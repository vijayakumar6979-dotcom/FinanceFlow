
import { useRegisterSW } from 'virtual:pwa-register/react'
import { Button } from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

export function ReloadPrompt() {
    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r)
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        },
    })

    const close = () => {
        setOfflineReady(false)
        setNeedRefresh(false)
    }

    return (
        <AnimatePresence>
            {(offlineReady || needRefresh) && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="fixed bottom-6 right-6 z-50 p-4 bg-slate-900 dark:bg-slate-800 text-white rounded-xl shadow-lg border border-slate-700 max-w-sm"
                >
                    <div className="flex flex-col gap-2">
                        <div className="text-sm font-medium">
                            {offlineReady
                                ? 'App ready to work offline'
                                : 'New content available, click on reload button to update.'}
                        </div>
                        <div className="flex gap-2 mt-2">
                            {needRefresh && (
                                <Button
                                    size="sm"
                                    className="bg-primary-600 hover:bg-primary-700 text-white text-xs h-8"
                                    onClick={() => updateServiceWorker(true)}
                                >
                                    Reload
                                </Button>
                            )}
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-slate-600 text-white hover:bg-slate-700 text-xs h-8"
                                onClick={close}
                            >
                                Close
                            </Button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
