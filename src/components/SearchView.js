import React from "react";
import Title from "components/Title";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { locale, addLocale } from "primereact/api";
import dayjs from "dayjs";
import * as Yup from "yup";

import { Card } from "primereact/card";

locale("pt");

addLocale("pt", {
  closeText: "Fechar",
  prevText: "Anterior",
  nextText: "Próximo",
  currentText: "Começo",
  monthNames: [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ],
  monthNamesShort: [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ],
  dayNames: [
    "Domingo",
    "Segunda",
    "Terça",
    "Quarta",
    "Quinta",
    "Sexta",
    "Sábado",
  ],
  dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
  dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
  weekHeader: "Semana",
  firstDay: 1,
  isRTL: false,
  showMonthAfterYear: false,
  yearSuffix: "",
  timeOnlyTitle: "Só Horas",
  timeText: "Tempo",
  hourText: "Hora",
  minuteText: "Minuto",
  secondText: "Segundo",
  ampm: false,
  month: "Mês",
  week: "Semana",
  day: "Dia",
  allDayText: "Todo Dia",
  today: "Hoje",
  clear: "Limpar",
});

const personValidation = Yup.object().shape({
  height: Yup.number().min(0, "Altura deve ser maior ou igual a 0"),
  weight: Yup.number().min(0, "Peso deve ser maior ou igual a 0"),
});

function SearchView({ handleParamsChange }) {
  const sexOptions = [
    { name: "Mulher", code: "F" },
    { name: "Homem", code: "M" },
  ];

  const formik = useFormik({
    initialValues: {
      name: "",
      cpf: "",
      birthday: "",
      sex: "",
      height: 0,
      weight: 0,
    },
    validationSchema: personValidation,
    onSubmit: (data) => {
      const dataFormatted = { ...data };
      dataFormatted.birthday = dayjs(dataFormatted.birthday).isValid()
        ? dayjs(data.birthday).format("YYYY-MM-DD")
        : "";
      handleParamsChange(dataFormatted);
    },
  });

  const isFormFieldInvalid = (field) =>
    !!(formik.touched[field] && formik.errors[field]);

  const getFormErrorMessage = (error) =>
    isFormFieldInvalid(error) ? (
      <small className="p-error">{formik.errors[error]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );

  return (
    <div className="flex justify-content-center flex-wrap">
      <Card className="md:col-8">
        <Title title="Filtros de pesquisa" />
        <form className="p-fluid">
          <div className="grid">
            <div className="md:col-4 sm:col-12 p-3">
              <span className="p-float-label">
                <InputText
                  id="name"
                  name="name"
                  type="text"
                  data-testid="name"
                  value={formik.values.name}
                  onChange={(e) => {
                    formik.setFieldValue("name", e.target.value);
                  }}
                />
                <label htmlFor="name">Nome</label>
              </span>
            </div>
            <div className="md:col-4 sm:col-12 p-3">
              <span className="p-float-label">
                <InputText
                  id="cpf"
                  name="cpf"
                  type="text"
                  data-testid="cpf"
                  value={formik.values.cpf}
                  onChange={(e) => {
                    formik.setFieldValue("cpf", e.target.value);
                  }}
                />
                <label htmlFor="cpf">CPF</label>
              </span>
            </div>

            <div className="md:col-4 sm:col-12 p-3">
              <span className="p-float-label">
                <Dropdown
                  inputId="sex"
                  name="sex"
                  data-testid="sex"
                  value={formik.values.sex}
                  onChange={(e) => formik.setFieldValue("sex", e.value)}
                  options={sexOptions}
                  optionValue="code"
                  optionLabel="name"
                  placeholder="Selecione o Sexo"
                  showClear
                />
                <label htmlFor="sex">Sexo</label>
              </span>
            </div>

            <div className="md:col-4 sm:col-12 p-3">
              <span className="p-float-label">
                <Calendar
                  id="birthday"
                  value={formik.values.birthday}
                  onChange={(e) =>
                    formik.setFieldValue("birthday", e.target.value)
                  }
                  dateFormat="yy/mm/dd"
                  mask="9999/99/99"
                  showIcon
                  showButtonBar
                />
                <label htmlFor="birthday">Data Nascimento (após)</label>
              </span>
            </div>

            <div className="md:col-4 sm:col-12 p-3">
              <span className="p-float-label">
                <InputText
                  id="height"
                  name="height"
                  type="number"
                  data-testid="height"
                  value={formik.values.height}
                  onChange={(e) => {
                    formik.setFieldValue("height", e.target.value);
                  }}
                />
                <label htmlFor="height">Altura (cm) - maior que</label>
              </span>
              {getFormErrorMessage("height")}
            </div>

            <div className="md:col-4 sm:col-12 p-3">
              <span className="p-float-label">
                <InputText
                  id="weight"
                  name="weight"
                  type="number"
                  data-testid="weight"
                  value={formik.values.weight}
                  onChange={(e) => {
                    formik.setFieldValue("weight", e.target.value);
                  }}
                />
                <label htmlFor="weight">Peso (kg) maior que</label>
              </span>
              {getFormErrorMessage("weight")}
            </div>
          </div>
        </form>

        <div className="grid justify-content-center">
          <Button
            type="button"
            onClick={formik.handleSubmit}
            label="Pesquisar"
            className="md:col-2 sm:col-6 m-1"
          />
          <Button
            onClick={formik.handleReset}
            label="Limpar"
            className="md:col-2 sm:col-6 m-1"
            severity="danger"
          />
        </div>
      </Card>
    </div>
  );
}

export default SearchView;
