import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nome, telefone, email, mensagem, aceitaMarketing } = body;

    // Validação básica
    if (!nome || !telefone || !email || !mensagem) {
      return NextResponse.json(
        { error: "Todos os campos são obrigatórios" },
        { status: 400 }
      );
    }

    // Enviar para o HubSpot
    const response = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            email: email,
            firstname: nome,
            phone: telefone,
            message: mensagem,
            hs_marketable_status: aceitaMarketing ? "true" : "false",
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Erro ao enviar contato para HubSpot:", errorData);
      throw new Error("Erro na requisição para HubSpot");
    }

    return NextResponse.json(
      { message: "Contato enviado com sucesso!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "Erro ao enviar contato:",
      error.message
    );

    return NextResponse.json(
      { error: "Erro ao enviar contato. Tente novamente." },
      { status: 500 }
    );
  }
}
