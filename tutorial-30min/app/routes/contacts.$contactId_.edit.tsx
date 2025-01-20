// Tenga en cuenta lo extraño _ de $contactId_. De forma predeterminada, 
// las rutas se anidarán automáticamente dentro de las rutas con el mismo nombre prefijado.
// Agregar un final _indica a la ruta que no se anide dentro de app/routes/contacts.$contactId.tsx
// https://remix.run/docs/en/main/file-conventions/routes

import type {
    ActionFunctionArgs,
    LoaderFunctionArgs,
  } from "@remix-run/node";
  import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import invariant from "tiny-invariant";

import { getContact, updateContact } from "../data";

export const action = async ({
    params,
    request,
  }: ActionFunctionArgs) => {
    invariant(params.contactId, "Missing contactId param");
    const formData = await request.formData();
    // const firstName = formData.get("first");
    // const lastName = formData.get("last");
    const updates = Object.fromEntries(formData);
    await updateContact(params.contactId, updates);
    return redirect(`/contacts/${params.contactId}`);
    // Sin JavaScript, redirectsería una redirección normal. 
    // Sin embargo, con JavaScript es una redirección del lado del cliente, 
    // por lo que el usuario no pierde el estado del cliente, 
    // como las posiciones de desplazamiento o el estado del componente.
  };

export const loader = async ({
  params,
}: LoaderFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const contact = await getContact(params.contactId);
  if (!contact) {
    throw new Response("Not Found", { status: 404 });
  }
  return json({ contact });
};

export default function EditContact() {
  const { contact } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  return (
    <Form key={contact.id} id="contact-form" method="post">
      <p>
        <span>Name</span>
        <input
          aria-label="First name"
          defaultValue={contact.first}
          name="first"
          placeholder="First"
          type="text"
        />
        <input
          aria-label="Last name"
          defaultValue={contact.last}
          name="last"
          placeholder="Last"
          type="text"
        />
      </p>
      <label>
        <span>Twitter</span>
        <input
          defaultValue={contact.twitter}
          name="twitter"
          placeholder="@jack"
          type="text"
        />
      </label>
      <label>
        <span>Avatar URL</span>
        <input
          aria-label="Avatar URL"
          defaultValue={contact.avatar}
          name="avatar"
          placeholder="https://example.com/avatar.jpg"
          type="text"
        />
      </label>
      <label>
        <span>Notes</span>
        <textarea
          defaultValue={contact.notes}
          name="notes"
          rows={6}
        />
      </label>
      <p>
        <button type="submit">Save</button>
        <button onClick={() => navigate(-1)} /* enviará hacia atrás una entrada en el historial del navegador */  type="button">Cancel</button>
      </p>
    </Form>
  );
}
