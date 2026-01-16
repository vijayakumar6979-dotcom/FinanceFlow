import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
// import { Label } from '@/components/ui/label'; // We don't have Label component, Input has built-in label
import { investmentService } from '@/services/investment.service';
import { marketService } from '@/services/market.service';

interface AddInvestmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function AddInvestmentModal({ isOpen, onClose, onSuccess }: AddInvestmentModalProps) {
    const [step, setStep] = useState(1);
    const [type, setType] = useState('stock');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [selectedAsset, setSelectedAsset] = useState<any>(null);
    const [formData, setFormData] = useState({
        quantity: '',
        price: '',
        date: new Date().toISOString().split('T')[0]
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSearch = async (query: string) => {
        setSearchQuery(query);
        if (query.length > 1) {
            const results = await marketService.search(query);
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    };

    const handleSelectAsset = (asset: any) => {
        setSelectedAsset(asset);
        // Pre-fill price if possible
        marketService.getQuote(asset.symbol).then(quote => {
            setFormData(prev => ({ ...prev, price: quote.price.toString() }));
        });
        setStep(3);
    };

    const handleSubmit = async () => {
        try {
            setIsSubmitting(true);
            await investmentService.create({
                symbol: selectedAsset.symbol,
                name: selectedAsset.name,
                type: type as any,
                quantity: parseFloat(formData.quantity),
                avg_cost: parseFloat(formData.price),
                currency: 'MYR', // Default for now
                exchange: 'bursa', // Default for now
                notes: ''
            });
            onSuccess();
            onClose();
            // Reset
            setStep(1);
            setSelectedAsset(null);
            setFormData({ quantity: '', price: '', date: new Date().toISOString().split('T')[0] });
        } catch (error) {
            console.error(error);
            alert('Failed to add investment');
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStep1 = () => (
        <div className="grid grid-cols-2 gap-4">
            {['Stock', 'Crypto', 'Fund', 'ETF', 'Bond', 'Real Estate'].map((t) => (
                <button
                    key={t}
                    className={`h-24 flex flex-col items-center justify-center gap-2 border rounded-xl hover:bg-white/5 transition-colors ${type === t.toLowerCase().replace(' ', '_') ? 'border-primary-500 bg-primary-500/10 text-primary-500' : 'border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400'}`}
                    onClick={() => {
                        setType(t.toLowerCase().replace(' ', '_'));
                        setStep(2);
                    }}
                >
                    <span className="font-semibold">{t}</span>
                </button>
            ))}
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-4">
            <Input
                label="Search Asset"
                placeholder="Search by symbol or name..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
            />
            <div className="max-h-[300px] overflow-y-auto space-y-2 custom-scrollbar">
                {searchResults.map((result) => (
                    <div
                        key={result.symbol}
                        onClick={() => handleSelectAsset(result)}
                        className="p-3 rounded-lg bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer flex justify-between items-center transition-colors"
                    >
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">{result.symbol}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{result.name}</p>
                        </div>
                        <span className="text-xs px-2 py-1 rounded bg-gray-200 dark:bg-white/10 text-gray-700 dark:text-gray-300">{result.type}</span>
                    </div>
                ))}
                {searchQuery.length > 1 && searchResults.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-4">No assets found</p>
                )}
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-4">
            {selectedAsset && (
                <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-200 dark:border-primary-500/20 mb-4">
                    <p className="text-sm text-primary-600 dark:text-primary-300">Adding Investment</p>
                    <p className="font-bold text-lg text-primary-900 dark:text-primary-100">{selectedAsset.symbol} - {selectedAsset.name}</p>
                </div>
            )}

            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Quantity"
                    type="number"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                />
                <Input
                    label="Price per Unit"
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                />
            </div>
            <Input
                label="Purchase Date"
                type="date"
                value={formData.date}
                onChange={e => setFormData({ ...formData, date: e.target.value })}
            />
            <div className="pt-4 border-t border-gray-200 dark:border-white/10">
                <div className="flex justify-between items-center mb-4">
                    <span className="text-gray-500 dark:text-gray-400">Total Investment</span>
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                        RM {(parseFloat(formData.quantity || '0') * parseFloat(formData.price || '0')).toFixed(2)}
                    </span>
                </div>
            </div>
        </div>
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Add New Investment">
            <ModalBody>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
            </ModalBody>

            <ModalFooter>
                {step > 1 && (
                    <Button variant="ghost" onClick={() => setStep(step - 1)}>Back</Button>
                )}
                {step === 3 && (
                    <Button
                        onClick={handleSubmit}
                        disabled={!formData.quantity || !formData.price || isSubmitting}
                        className="bg-primary-600 hover:bg-primary-700 text-white"
                    >
                        {isSubmitting ? 'Saving...' : 'Save Investment'}
                    </Button>
                )}
            </ModalFooter>
        </Modal>
    );
}
