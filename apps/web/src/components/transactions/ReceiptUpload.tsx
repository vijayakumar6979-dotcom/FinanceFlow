import { useState } from 'react'
import { Upload, Camera, X, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'

interface ReceiptUploadProps {
    onReceiptExtracted?: (data: {
        merchant: string
        amount: number
        date: string
        category?: string
    }) => void
}

export function ReceiptUpload({ onReceiptExtracted }: ReceiptUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [receipt, setReceipt] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('File size must be less than 5MB')
            return
        }

        setReceipt(file)
        setPreviewUrl(URL.createObjectURL(file))

        // Auto-process receipt
        await processReceipt(file)
    }

    const processReceipt = async (file: File) => {
        setUploading(true)
        try {
            // TODO: Implement OCR processing with Supabase Edge Function
            // For now, simulate processing
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Mock extracted data
            const mockData = {
                merchant: 'Starbucks',
                amount: 15.50,
                date: new Date().toISOString().split('T')[0],
                category: 'Food & Dining'
            }

            onReceiptExtracted?.(mockData)
            toast.success('Receipt processed! Data extracted successfully.')
        } catch (error) {
            toast.error('Failed to process receipt')
        } finally {
            setUploading(false)
        }
    }

    const handleRemove = () => {
        setReceipt(null)
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl)
            setPreviewUrl(null)
        }
    }

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Receipt (Optional)
            </label>

            {!receipt ? (
                <div className="border-2 border-dashed border-gray-300 dark:border-white/10 rounded-xl p-8 text-center hover:border-primary-500 dark:hover:border-primary-500 transition-colors">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        id="receipt-upload"
                    />
                    <label
                        htmlFor="receipt-upload"
                        className="cursor-pointer flex flex-col items-center gap-3"
                    >
                        <div className="w-16 h-16 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center">
                            <Upload className="w-8 h-8 text-gray-400" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                Upload Receipt
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                PNG, JPG up to 5MB
                            </p>
                        </div>
                        <Button type="button" variant="outline" size="sm">
                            Choose File
                        </Button>
                    </label>
                </div>
            ) : (
                <div className="relative bg-gray-50 dark:bg-white/5 rounded-xl p-4 border border-gray-200 dark:border-white/10">
                    {uploading && (
                        <div className="absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center z-10">
                            <div className="text-center text-white">
                                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                                <p className="text-sm">Processing receipt...</p>
                            </div>
                        </div>
                    )}

                    <div className="flex items-start gap-4">
                        {previewUrl && (
                            <img
                                src={previewUrl}
                                alt="Receipt preview"
                                className="w-24 h-24 object-cover rounded-lg"
                            />
                        )}
                        <div className="flex-1">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {receipt.name}
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {(receipt.size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                                <button
                                    onClick={handleRemove}
                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                    type="button"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {uploading && (
                                <div className="mt-2">
                                    <div className="h-1 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-primary-500 animate-pulse w-3/4"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400">
                Upload a receipt to automatically extract transaction details using OCR
            </p>
        </div>
    )
}
