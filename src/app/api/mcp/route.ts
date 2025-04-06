import { NextRequest } from 'next/server'

export const runtime = 'node' 

export async function POST(req: NextRequest) {
    const { readable, writable } = new TransformStream()
    const writer = writable.getWriter()

    try {
        const body = await req.json()
        const prompt = body?.messages?.at(-1)?.content || 'Sem prompt recebido.'
        const result = interpretarPrompt(prompt)

        // envia no formato SSE
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

    if (lower.includes('log')) {
        return 'Simulação: Nenhum erro encontrado nos logs até o momento.'
    }

    return `Prompt recebido: "${prompt}"`
}
