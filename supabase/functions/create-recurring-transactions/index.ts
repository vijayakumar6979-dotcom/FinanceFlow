// Edge Function: create-recurring-transactions
// Schedule: Daily at midnight (0 0 * * *)
// Purpose: Automatically create transactions from recurring templates

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
    try {
        // Initialize Supabase client with service role key (bypasses RLS)
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const today = new Date().toISOString().split('T')[0]

        // Get all active recurring transactions due today or earlier
        const { data: recurringTransactions, error: fetchError } = await supabaseAdmin
            .from('recurring_transactions')
            .select('*')
            .eq('is_active', true)
            .lte('next_occurrence_date', today)

        if (fetchError) throw fetchError

        console.log(`Found ${recurringTransactions?.length || 0} recurring transactions to process`)

        const results = {
            created: 0,
            failed: 0,
            deactivated: 0,
            errors: [] as string[]
        }

        // Process each recurring transaction
        for (const recurring of recurringTransactions || []) {
            try {
                // Create the transaction
                const { data: newTransaction, error: createError } = await supabaseAdmin
                    .from('transactions')
                    .insert({
                        user_id: recurring.user_id,
                        account_id: recurring.account_id,
                        category_id: recurring.category_id,
                        type: recurring.type,
                        amount: recurring.amount,
                        date: recurring.next_occurrence_date,
                        description: recurring.description,
                        notes: recurring.notes,
                        tags: recurring.tags,
                        is_recurring_instance: true,
                        recurring_transaction_id: recurring.id
                    })
                    .select()
                    .single()

                if (createError) {
                    console.error(`Failed to create transaction for recurring ${recurring.id}:`, createError)
                    results.failed++
                    results.errors.push(`Recurring ${recurring.id}: ${createError.message}`)
                    continue
                }

                console.log(`Created transaction ${newTransaction.id} from recurring ${recurring.id}`)
                results.created++

                // Calculate next occurrence date
                let nextDate: Date
                const currentDate = new Date(recurring.next_occurrence_date)

                switch (recurring.frequency) {
                    case 'daily':
                        nextDate = new Date(currentDate)
                        nextDate.setDate(currentDate.getDate() + recurring.interval)
                        break
                    case 'weekly':
                        nextDate = new Date(currentDate)
                        nextDate.setDate(currentDate.getDate() + (7 * recurring.interval))
                        break
                    case 'biweekly':
                        nextDate = new Date(currentDate)
                        nextDate.setDate(currentDate.getDate() + (14 * recurring.interval))
                        break
                    case 'monthly':
                        nextDate = new Date(currentDate)
                        nextDate.setMonth(currentDate.getMonth() + recurring.interval)
                        break
                    case 'quarterly':
                        nextDate = new Date(currentDate)
                        nextDate.setMonth(currentDate.getMonth() + (3 * recurring.interval))
                        break
                    case 'yearly':
                        nextDate = new Date(currentDate)
                        nextDate.setFullYear(currentDate.getFullYear() + recurring.interval)
                        break
                    default:
                        throw new Error(`Unknown frequency: ${recurring.frequency}`)
                }

                const nextDateStr = nextDate.toISOString().split('T')[0]
                const newOccurrencesCount = recurring.occurrences_created + 1

                // Check if we should deactivate
                let shouldDeactivate = false
                if (recurring.end_date && nextDateStr > recurring.end_date) {
                    shouldDeactivate = true
                }
                if (recurring.end_after_occurrences && newOccurrencesCount >= recurring.end_after_occurrences) {
                    shouldDeactivate = true
                }

                // Update recurring transaction
                const updateData: any = {
                    last_occurrence_date: recurring.next_occurrence_date,
                    occurrences_created: newOccurrencesCount,
                    updated_at: new Date().toISOString()
                }

                if (shouldDeactivate) {
                    updateData.is_active = false
                    updateData.next_occurrence_date = null
                    results.deactivated++
                } else {
                    updateData.next_occurrence_date = nextDateStr
                }

                const { error: updateError } = await supabaseAdmin
                    .from('recurring_transactions')
                    .update(updateData)
                    .eq('id', recurring.id)

                if (updateError) {
                    console.error(`Failed to update recurring ${recurring.id}:`, updateError)
                    results.errors.push(`Update recurring ${recurring.id}: ${updateError.message}`)
                }

                // Send notification
                try {
                    const { data: profile } = await supabaseAdmin
                        .from('profiles')
                        .select('fcm_token')
                        .eq('id', recurring.user_id)
                        .single()

                    if (profile?.fcm_token) {
                        // TODO: Send FCM notification
                        console.log(`Would send notification to user ${recurring.user_id}`)
                    }
                } catch (notifError) {
                    console.error('Notification error:', notifError)
                }

            } catch (error) {
                console.error(`Error processing recurring ${recurring.id}:`, error)
                results.failed++
                results.errors.push(`Recurring ${recurring.id}: ${error.message}`)
            }
        }

        console.log('Recurring transactions processing complete:', results)

        return new Response(
            JSON.stringify({
                success: true,
                processed: recurringTransactions?.length || 0,
                created: results.created,
                failed: results.failed,
                deactivated: results.deactivated,
                errors: results.errors
            }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        console.error('Fatal error in create-recurring-transactions:', error)
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 500
            }
        )
    }
})
