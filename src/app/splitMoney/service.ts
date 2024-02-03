"use client";

import React from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

export interface ParticipantObject {
  id: number;
  name: string;
  amount: string;
}

type Inputs = {
  total: string;
  participants: Array<ParticipantObject>;
};

export default function useSplitMoneyService() {
  const [toastMessage, setToastMessage] = React.useState<string>();
  const [link, setLink] = React.useState<string>();

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const searchQuery = searchParams.get("data");
      if (searchQuery) {
        setToastMessage("Link Copied");
      }
    }
  }, []);
  const initialValues = React.useMemo(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search);
      const searchQuery = searchParams.get("data");
      if (searchQuery) {
        return JSON.parse(atob(searchQuery));
      }
    }

    return {};
  }, []);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm<Inputs>({
    defaultValues: initialValues
  });

  const fieldArrayHelper = useFieldArray({
    control,
    name: "participants"
  });

  const onSubmit: SubmitHandler<Inputs> = React.useCallback(data => {
    const encoded = btoa(JSON.stringify(data));
    setLink(
      `${window.location.origin}/${window.location.pathname}?data=${encoded}`
    );
    setToastMessage("Link Generated");
  }, []);

  const resetToastMessage = React.useCallback(() => {
    setToastMessage(undefined);
  }, []);

  return {
    register,
    handleSubmit,
    watch,
    errors,
    onSubmit,
    control,
    fieldArrayHelper,
    toastMessage,
    resetToastMessage,
    setToastMessage,
    link
  };
}
