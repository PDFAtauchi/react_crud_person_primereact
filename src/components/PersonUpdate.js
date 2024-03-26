import React, { useRef, useEffect, useState } from "react";
import { Button } from "primereact/button";
import { useFormik } from "formik";
import { classNames } from "primereact/utils";
import * as Yup from "yup";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import Title from "components/Title";
import { Calendar } from "primereact/calendar";
import { locale, addLocale } from "primereact/api";

import { useParams } from "react-router-dom";

import dayjs from "dayjs";
import axios from "axios";
import { Toast } from "primereact/toast";
import { APIS_ROUTES, APP_ROUTES } from "app_constants";
import { useNavigate } from "react-router";
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
  name: Yup.string().required("Nome é requerido"),
  cpf: Yup.string()
    .matches(
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
      "CPF deve estar no formato ___.___.___-__"
    )
    .required("CPF é obrigatório"),
  sex: Yup.string()
    .required("Sexo é requerido")
    .oneOf(["M", "F"], "Sexo deve ser Mulher ou Homem"),
  height: Yup.number().min(0, "Altura deve ser maior ou igual a 0"),
  weight: Yup.number().min(0, "Peso deve ser maior ou igual a 0"),
  birthday: Yup.date().required("Data Nascimento requerido"),
});

function PersonUpdate() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useRef(null);

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
        ? dayjs(dataFormatted.birthday).format("YYYY-MM-DD")
        : "";

      updatePerson(dataFormatted);
    },
  });

  useEffect(() => {
    const fetchPerson = async () => {
      await axios
        .get(APIS_ROUTES.API_GET.replace(":id", id))
        .then((response) => {
          const { data } = response;
          data.birthday = new Date(dayjs(data.birthday).format("YYYY-MM-DD"));
          formik.setValues(data);
          setLoading(false);
        })
        .catch((error) => {
          setError("Erro recuperando pessoa");
          setLoading(false);
        });
    };

    fetchPerson();
  }, []);

  if (loading) {
    return (
      <div className="card justify-content-center">
        <Title title="Carregando...." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="card justify-content-center">
        <Title title={error} />
      </div>
    );
  }

  const updatePerson = async (data) => {
    await axios
      .put(`${APIS_ROUTES.API_UPDATE.replace(":id", id)}`, data)
      .then((response) => {
        toast.current.show({
          severity: "success",
          summary: "",
          detail: ["Atualizado"],
          life: 3000,
        });
      })
      .catch((error) => {
        let errorData = "";
        if (error?.response?.status === 400) {
          errorData = error?.response?.data;
          formik.setErrors(errorData);
        } else if (
          error?.response?.status === 404 ||
          error?.response?.status === 500
        ) {
          errorData = error?.response?.data;
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: errorData.message,
            life: 3000,
          });
          navigate(0);
        }
      });
  };

  const deletePerson = async () => {
    await axios
      .delete(`${APIS_ROUTES.API_DELETE.replace(":id", id)}`)
      .then((response) => {
        toast.current.show({
          severity: "error",
          summary: "",
          detail: ["Deletado"],
          life: 3000,
        });
        setTimeout(() => {
          navigate(APP_ROUTES.LIST_PERSON);
        }, 500);
      })
      .catch((error) => {
        let errorData = "";
        if (
          error?.response?.status === 404 ||
          error?.response?.status === 500
        ) {
          errorData = error?.response?.data;
          toast.current.show({
            severity: "error",
            summary: "Error",
            detail: errorData.message,
            life: 3000,
          });
        }
      });
  };

  const isFormFieldInvalid = (field) =>
    !!(formik.touched[field] && formik.errors[field]);

  const getFormErrorMessage = (error) =>
    isFormFieldInvalid(error) ? (
      <small className="p-error">{formik.errors[error]}</small>
    ) : (
      <small className="p-error">&nbsp;</small>
    );

  return (
    <>
      <Toast ref={toast} />
      <div className="flex justify-content-center flex-wrap">
        <Card className="md:col-12">
          <div style={{ textAlign: "left" }}>
            <Button
              severity="primary"
              onClick={(e) => navigate(APP_ROUTES.LIST_PERSON)}
              className="md:col-2 sm:col-6 m-1"
              label="Voltar à tela principal"
            />
          </div>
          <Title title="Atualizar Pessoa" />

          <form className="p-fluid">
            <div className="grid">
              <div className="md:col-6 sm:col-12 p-3">
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
                    className={classNames({
                      "p-invalid": isFormFieldInvalid("name"),
                    })}
                  />
                  <label htmlFor="name">Nome</label>
                </span>
                {getFormErrorMessage("name")}
              </div>

              <div className="md:col-6 sm:col-12 p-3">
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
                    className={classNames({
                      "p-invalid": isFormFieldInvalid("cpf"),
                    })}
                  />
                  <label htmlFor="cpf">CPF</label>
                </span>
                {getFormErrorMessage("cpf")}
              </div>

              <div className="md:col-6 sm:col-12 p-3">
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
                    className={classNames({
                      "p-invalid": isFormFieldInvalid("sex"),
                    })}
                  />
                  <label htmlFor="sex">Sexo</label>
                </span>
                {getFormErrorMessage("sex")}
              </div>

              <div className="md:col-6 sm:col-12 p-3">
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
                  <label htmlFor="birthday">Data Nascimento</label>
                </span>
                {getFormErrorMessage("birthday")}
              </div>

              <div className="md:col-6 sm:col-12 p-3">
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
                    className={classNames({
                      "p-invalid": isFormFieldInvalid("height"),
                    })}
                  />
                  <label htmlFor="height">Altura (cm)</label>
                </span>
                {getFormErrorMessage("height")}
              </div>

              <div className="md:col-6 sm:col-12 p-3">
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
                    className={classNames({
                      "p-invalid": isFormFieldInvalid("weight"),
                    })}
                  />
                  <label htmlFor="weight">Peso (kg)</label>
                </span>
                {getFormErrorMessage("weight")}
              </div>
            </div>
          </form>

          <div className="grid justify-content-center">
            <Button
              label="Atualizar"
              data-testid="btn_submit"
              className="md:col-2 sm:col-6 m-1"
              type="submit"
              onClick={formik.handleSubmit}
              severity="primary"
            />
            <Button
              data-testid="btn_delete"
              label="Deletar"
              onClick={deletePerson}
              className="md:col-2 sm:col-6 m-1"
              severity="danger"
            />
          </div>
        </Card>
      </div>
    </>
  );
}

export default PersonUpdate;
