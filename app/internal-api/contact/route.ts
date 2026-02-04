import { NextRequest, NextResponse } from "next/server";

interface ContactData {
  email: string;
  nome: string;
  telefone: string;
  mensagem: string;
  aceitaMarketing: boolean;
}

interface HubSpotContact {
  id: string;
  properties: {
    message?: string;
    [key: string]: string | undefined;
  };
}

async function searchContactByEmail(
  email: string,
  token: string
): Promise<HubSpotContact | null> {
  const response = await fetch(
    "https://api.hubapi.com/crm/v3/objects/contacts/search",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: "email",
                operator: "EQ",
                value: email,
              },
            ],
          },
        ],
        properties: ["email", "firstname", "phone", "message"],
      }),
    }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  return data.results?.[0] || null;
}

async function createContact(
  contactData: ContactData,
  token: string
): Promise<Response> {
  const { email, nome, telefone, mensagem, aceitaMarketing } = contactData;
  const timestamp = new Date().toLocaleString("pt-PT");

  return fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        email: email,
        firstname: `${nome} (Site Agência Douro)`,
        phone: telefone,
        message: `[${timestamp}]\n${mensagem}`,
        hs_marketable_status: aceitaMarketing ? "true" : "false",
      },
    }),
  });
}

async function updateContact(
  contactId: string,
  contactData: ContactData,
  existingMessage: string | undefined,
  token: string
): Promise<Response> {
  const { telefone, mensagem, aceitaMarketing } = contactData;
  const timestamp = new Date().toLocaleString("pt-PT");

  // Append new message to existing messages
  const newMessage = `[${timestamp}]\n${mensagem}`;
  const fullMessage = existingMessage
    ? `${existingMessage}\n\n---\n\n${newMessage}`
    : newMessage;

  return fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      properties: {
        phone: telefone,
        message: fullMessage,
        hs_marketable_status: aceitaMarketing ? "true" : "false",
      },
    }),
  });
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactData = await request.json();
    const { email, nome, telefone, mensagem, aceitaMarketing } = body;

    // Validar dados
    if (!email || !nome || !telefone || !mensagem) {
      return NextResponse.json(
        { error: "Todos os campos obrigatórios devem ser preenchidos" },
        { status: 400 }
      );
    }

    // Token deve vir de variável de ambiente
    const hubspotToken = process.env.HUBSPOT_API_TOKEN;

    if (!hubspotToken) {
      console.error("HUBSPOT_API_TOKEN não configurado");
      return NextResponse.json(
        { error: "Configuração do servidor incompleta" },
        { status: 500 }
      );
    }

    // Check if contact already exists
    const existingContact = await searchContactByEmail(email, hubspotToken);

    let response: Response;

    if (existingContact) {
      // Update existing contact and append message
      response = await updateContact(
        existingContact.id,
        { email, nome, telefone, mensagem, aceitaMarketing },
        existingContact.properties.message,
        hubspotToken
      );
    } else {
      // Create new contact
      response = await createContact(
        { email, nome, telefone, mensagem, aceitaMarketing },
        hubspotToken
      );
    }

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Erro do HubSpot:", errorData);
      return NextResponse.json(
        { error: "Erro ao enviar contato" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      message: "Contato enviado com sucesso",
      data,
      isUpdate: !!existingContact,
    });
  } catch (error) {
    console.error("Erro ao processar contato:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
