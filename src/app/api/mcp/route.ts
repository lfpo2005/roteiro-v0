import { NextRequest } from 'next/server'

export const runtime = 'nodejs' // muito importante: nodejs, não 'node' nem 'edge'

export async function POST(req: NextRequest) {
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()

    try {
        const body = await req.json()
        const prompt = body?.messages?.at(-1)?.content || 'Sem prompt recebido.'
        const result = interpretarPrompt(prompt)

        // ENVIA A RESPOSTA NO PADRÃO SSE (imediatamente)
        await writer.write(
            new TextEncoder().encode(`data: ${JSON.stringify({ result })}\n\n`)
        )
    } catch (error) {
        await writer.write(
            new TextEncoder().encode(`data: ${JSON.stringify({ error: 'Erro ao processar o prompt.' })}\n\n`)
        )
    } finally {
        // FECHA o writer após o envio (evita TIMEOUT)
        writer.close()
    }

    return new Response(readable, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    })
}

function interpretarPrompt(prompt: string): string {
    const lower = prompt.toLowerCase()

    if (lower.includes('log')) {
        return '🧾 Nenhum erro crítico encontrado nos logs recentes do sistema.'
    }

    return `🟢 Prompt recebido: "${prompt}"`
}
