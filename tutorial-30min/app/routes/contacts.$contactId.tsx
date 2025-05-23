// .: Crea un / en la URL para estructurar rutas jerárquicamente.
// $: Hace que un segmento de la URL sea dinámico, permitiendo capturar valores como parámetros. (Params)
// contacts.$contactId.tsx -> /contacts/123 

import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useFetcher, useLoaderData } from "@remix-run/react";
import type { FunctionComponent } from "react";

import type { ContactRecord } from "../data";
import { getContact, updateContact } from "../data";
import invariant from "tiny-invariant";

export const action = async ({
  params,
  request,
}: ActionFunctionArgs) => {
  invariant(params.contactId, "Missing contactId param");
  const formData = await request.formData();
  return updateContact(params.contactId, {
    favorite: formData.get("favorite") === "true",
  });
};

export const loader = async ({
    params,
  }: LoaderFunctionArgs) => {
    invariant(params.contactId, "Missing contactId param");
    const contact = await getContact(params.contactId);
    // si no se encuentra al usuario, la ejecución del código en esta ruta se detiene y 
    // Remix muestra la ruta con error en su lugar. 
    // Los componentes en Remix pueden centrarse solo en la ruta correcta
    if (!contact) {
        throw new Response("Not Found", { status: 404 });
      }
    return json({ contact });
  };

export default function Contact() {
    const { contact } = useLoaderData<typeof loader>();
  // const contact = {
  //   first: "Your",
  //   last: "Name",
  //   avatar: "https://placecats.com/200/200",
  //   twitter: "your_handle",
  //   notes: "Some notes",
  //   favorite: true,
  // };

  return (
    <div id="contact">
      <div>
        <img
          alt={`${contact.first} ${contact.last} avatar`}
          key={contact.avatar}
          src={contact.avatar}
        />
      </div>

      <div>
        <h1>
          {contact.first || contact.last ? (
            <>
              {contact.first} {contact.last}
            </>
          ) : (
            <i>No Name</i>
          )}{" "}
          <Favorite contact={contact} />
        </h1>

        {contact.twitter ? (
          <p>
            <a
              href={`https://twitter.com/${contact.twitter}`}
            >
              {contact.twitter}
            </a>
          </p>
        ) : null}

        {contact.notes ? <p>{contact.notes}</p> : null}

        <div>
          <Form action="edit">
            <button type="submit">Edit</button>
          </Form>

          <Form
            action="destroy" // contacts.$contactId.tsx redirige a contacts.$contactId_.destroy.tsx
            method="post"
            onSubmit={(event) => {
              const response = confirm(
                "Please confirm you want to delete this record."
              );
              if (!response) {
                event.preventDefault();
              }
            }}
          >
            <button type="submit">Delete</button>
          </Form>
        </div>
      </div>
    </div>
  );
}

const Favorite: FunctionComponent<{
  contact: Pick<ContactRecord, "favorite">;
}> = ({ contact }) => {
  // const favorite = contact.favorite;
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : contact.favorite;

  return (
    <fetcher.Form method="post">
      <button
        aria-label={
          favorite
            ? "Remove from favorites"
            : "Add to favorites"
        }
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
      </fetcher.Form>
  );
};
