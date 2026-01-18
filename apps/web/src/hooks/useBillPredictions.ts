import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/services/supabase';
import type { BillPrediction, BillAnomaly } from '@financeflow/shared';

// Predict bill amount
async function predictBillAmount(billId: string, predictionMonth: string): Promise<BillPrediction> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('predict-bill-amount', {
        body: { billId, predictionMonth },
    });

    if (error) throw error;
    return data;
}

// Detect anomalies
async function detectBillAnomalies(billId: string, currentAmount: number): Promise<BillAnomaly> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) throw new Error('Not authenticated');

    const { data, error } = await supabase.functions.invoke('detect-bill-anomalies', {
        body: { billId, currentAmount },
    });

    if (error) throw error;
    return data;
}

// Get prediction for a bill
async function getBillPrediction(billId: string, month: string): Promise<BillPrediction | null> {
    const { data, error } = await supabase
        .from('bill_predictions')
        .select('*')
        .eq('bill_id', billId)
        .eq('prediction_month', month)
        .single();

    if (error && error.code !== 'PGRST116') throw error; // Ignore not found error
    return data;
}

// Hooks
export function usePredictBillAmount() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ billId, predictionMonth }: { billId: string; predictionMonth: string }) =>
            predictBillAmount(billId, predictionMonth),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['bill-prediction', variables.billId] });
            queryClient.invalidateQueries({ queryKey: ['bills'] });
        },
    });
}

export function useDetectBillAnomalies() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ billId, currentAmount }: { billId: string; currentAmount: number }) =>
            detectBillAnomalies(billId, currentAmount),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['bills', variables.billId] });
            queryClient.invalidateQueries({ queryKey: ['bills'] });
        },
    });
}

export function useBillPrediction(billId: string, month: string) {
    return useQuery({
        queryKey: ['bill-prediction', billId, month],
        queryFn: () => getBillPrediction(billId, month),
        enabled: !!billId && !!month,
    });
}
