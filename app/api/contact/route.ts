import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

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
    await axios.post(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        properties: {
          email: email,
          firstname: nome,
          phone: telefone,
          message: mensagem,
          hs_marketable_status: aceitaMarketing ? "true" : "false",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUBSPOT_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(
      { message: "Contato enviado com sucesso!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error(
      "Erro ao enviar contato:",
      error.response?.data || error.message
    );

    return NextResponse.json(
      { error: "Erro ao enviar contato. Tente novamente." },
      { status: 500 }
    );
  }
}
