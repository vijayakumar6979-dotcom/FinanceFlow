// Edge Function: extract-receipt-data
// Purpose: OCR receipt scanning and data extraction using Grok API

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const { image_url, image_base64 } = await req.json()

        if (!image_url && !image_base64) {
            throw new Error('Either image_url or image_base64 is required')
        }

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        const { data: { user } } = await supabaseClient.auth.getUser()
        if (!user) throw new Error('Unauthorized')

        // Step 1: Perform OCR (using Tesseract.js or Google Vision API)
        // For this implementation, we'll use a simple text extraction
        // In production, integrate with Google Vision API or AWS Textract

        let ocrText = ''

        // Simulated OCR result (in production, call actual OCR service)
        // For now, we'll use Grok to extract from image description
        // In real implementation, you would:
        // 1. Upload image to Supabase Storage
        // 2. Call OCR API (Google Vision, AWS Textract, or Tesseract)
        // 3. Get raw text

        // For demo purposes, assuming we have OCR text
        // In production, call OCR service here
        const ocrApiKey = Deno.env.get('GOOGLE_VISION_API_KEY')

        if (ocrApiKey && image_base64) {
            // Call Google Vision API
            const visionResponse = await fetch(
                `https://vision.googleapis.com/v1/images:annotate?key=${ocrApiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        requests: [{
                            image: { content: image_base64 },
                            features: [{ type: 'TEXT_DETECTION' }]
                        }]
                    })
                }
            )

            if (visionResponse.ok) {
                const visionData = await visionResponse.json()
                ocrText = visionData.responses[0]?.fullTextAnnotation?.text || ''
            }
        } else {
            // Fallback: Use placeholder text
            ocrText = `
        MERCHANT NAME: Sample Store
        DATE: 2024-01-18
        TOTAL: RM 45.50
        ITEMS:
        - Coffee: RM 12.00
        - Sandwich: RM 18.50
        - Water: RM 5.00
        - Tax: RM 10.00
      `
        }

        // Step 2: Use Grok to parse OCR text
        const grokApiKey = Deno.env.get('GROK_API_KEY')
        if (!grokApiKey) {
            throw new Error('GROK_API_KEY not configured')
        }

        const grokPrompt = `Extract transaction details from this receipt OCR text:

${ocrText}

Return ONLY a valid JSON object with this exact structure (no markdown, no explanation):
{
  "merchant": "Merchant name",
  "amount": 45.50,
  "date": "2024-01-18",
  "category": "Suggested category",
  "items": [
    {"name": "Item 1", "price": 20.00},
    {"name": "Item 2", "price": 25.50}
  ]
}

Rules:
- Extract merchant name from header
- Find total amount (look for keywords: TOTAL, AMOUNT, SUBTOTAL)
- Extract date (format: YYYY-MM-DD)
- Suggest appropriate category based on merchant/items
- Extract line items if visible
- Return valid JSON only`

        const grokResponse = await fetch('https://api.x.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${grokApiKey}`
            },
            body: JSON.stringify({
                model: 'grok-beta',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a receipt data extraction expert. Always return valid JSON only, no markdown formatting.'
                    },
                    { role: 'user', content: grokPrompt }
                ],
                temperature: 0.1,
                max_tokens: 500
            })
        })

        if (!grokResponse.ok) {
            throw new Error(`Grok API error: ${grokResponse.statusText}`)
        }

        const grokData = await grokResponse.json()
        let extractedData = grokData.choices[0]?.message?.content?.trim()

        // Remove markdown code blocks if present
        extractedData = extractedData.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()

        // Parse JSON
        let parsedData
        try {
            parsedData = JSON.parse(extractedData)
        } catch (parseError) {
            console.error('Failed to parse Grok response:', extractedData)
            throw new Error('Failed to parse receipt data from AI response')
        }

        // Store OCR data
        const ocrDataToStore = {
            raw_text: ocrText,
            extracted_data: parsedData,
            extraction_timestamp: new Date().toISOString(),
            ocr_method: ocrApiKey ? 'google_vision' : 'simulated'
        }

        return new Response(
            JSON.stringify({
                success: true,
                merchant: parsedData.merchant,
                amount: parsedData.amount,
                date: parsedData.date,
                category: parsedData.category,
                items: parsedData.items || [],
                ocr_data: ocrDataToStore
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        console.error('Receipt extraction error:', error)
        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400
            }
        )
    }
})
