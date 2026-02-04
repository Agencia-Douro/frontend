import { NextRequest, NextResponse } from "next/server";

interface ContactData {
  email: string;
  nome: string;
  telefone: string;
  mensagem: string;
  aceitaMarketing: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactData = await request.json();
    const { email, nome, telefone, mensagem, aceitaMarketing } = body;

    // Validar dados
    if (!email || !nome || !telefone || !mensagem) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 },
      );
    }

    // Token deve vir de variável de ambiente
    const hubspotToken = process.env.HUBSPOT_API_TOKEN;

    if (!hubspotToken) {
      console.error("HUBSPOT_API_TOKEN não configurado");
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 },
      );
    }

    const response = await fetch(
      "https://api.hubapi.com/crm/v3/objects/contacts",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${hubspotToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          properties: {
            email: email,
            firstname: `${nome} (Site Agência Douro)`,
            phone: telefone,
            message: mensagem,
            hs_marketable_status: aceitaMarketing ? "true" : "false",
          },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro do HubSpot:", errorData);
      return NextResponse.json(
        { error: "Erro ao enviar contato" },
        { status: response.status },
      );
    }

    const data = await response.json();

    return NextResponse.json({
      message: "Contato enviado com sucesso",
      data,
    });
  } catch (error) {
    console.error("Erro ao processar contato:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 },
    );
  }
}
