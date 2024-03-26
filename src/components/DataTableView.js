import React, { useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { APP_ROUTES } from "app_constants";
import { useNavigate } from "react-router";
import { locale, addLocale } from "primereact/api";
import { getIdealWeight } from "helper";
import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";

locale("pt");

addLocale("pt", {
  emptyFilterMessage: "Resultado não encontrado",
  emptyMessage: "Não há registro de pessoas",
});

function DataTableView({ data }) {
  const navigate = useNavigate();

  const actionTemplate = (person) => {
    const PopUpMessage = (event) => {
      confirmPopup({
        target: event.currentTarget,
        message: getIdealWeight(person.height, person.sex),
      });
    };

    return (
      <div className="card flex justify-content-center">
        <Button
          severity="info"
          onClick={(e) =>
            navigate(`${APP_ROUTES.UPDATE_PERSON.replace(":id", person.id)}`)
          }
          className="md:col-6 m-1"
          label="Detalhes"
        />

        <ConfirmPopup
          content={({ message, acceptBtnRef, hide }) => (
            <div className="p-3">
              <span>{message}</span>
              <div className="flex align-items-center gap-2 mt-3">
                <Button
                  ref={acceptBtnRef}
                  label="Ok"
                  onClick={() => {
                    hide();
                  }}
                ></Button>
              </div>
            </div>
          )}
        />
        <Button
          severity="warning"
          onClick={PopUpMessage}
          label="Peso ideal"
        ></Button>
      </div>
    );
  };

  const sexTemplate = (person) => {
    const sexMap = {
      F: "Mulher",
      M: "Homem",
    };
    return sexMap[person.sex];
  };

  return (
    <div className="card">
      <div className="card">
        <DataTable
          locale="pt-br"
          value={data}
          showGridlines
          paginator
          rows={6}
          tableStyle={{ minWidth: "50rem" }}
        >
          <Column field="name" header="Nome" />
          <Column field="cpf" header="CPF" />
          <Column field="birthday" header="Data Nascimento" />
          <Column field="sex" header="Sexo" body={sexTemplate} />
          <Column field="height" header="Altura(cm)" />
          <Column field="weight" header="Peso(kg)" />
          <Column header="Ação" body={actionTemplate} />
        </DataTable>
      </div>
    </div>
  );
}

export default DataTableView;
