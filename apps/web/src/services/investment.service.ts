import { supabase } from './supabase';
import { createInvestmentService } from '@financeflow/shared';

export const investmentService = createInvestmentService(supabase);
