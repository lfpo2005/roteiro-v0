import { NextRequest } from 'next/server'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()

    try {
        const body = await req.json()
        const prompt = body?.messages?.at(-1)?.content || 'Sem prompt recebido.'
        const result = interpretarPrompt(prompt)

        await writer.write(
            new TextEncoder().encode(`data: ${JSON.stringify({ result })}\n\n`)
        )
    } catch (error) {
        await writer.write(
            new TextEncoder().encode(`data: ${JSON.stringify({ error: 'Erro ao processar o prompt.' })}\n\n`)
        )
    } finally {
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
    if (lower.includes('log')) return '🔍 Nenhum erro encontrado nos logs.'
    return `📩 Prompt recebido: "${prompt}"`
}
