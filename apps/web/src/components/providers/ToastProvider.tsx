import { Toaster, toast } from 'react-hot-toast'
import { CheckCircle, AlertCircle, X } from 'lucide-react'

export function ToastProvider() {
    return (
        <Toaster
            position="bottom-right"
            toastOptions={{
                duration: 4000,
                style: {
                    background: 'rgba(18, 22, 41, 0.9)',
                    backdropFilter: 'blur(32px) saturate(180%)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    borderRadius: '20px',
                    padding: '16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                },
                success: {
                    icon: <CheckCircle className="w-5 h-5 text-green-400" />,
                },
                error: {
                    icon: <AlertCircle className="w-5 h-5 text-red-400" />,
                },
            }}
        />
    )
}

export { toast }
