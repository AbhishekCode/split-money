"use client";

import React from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";

type Inputs = {
  total: string;
  participants: Array<{
    name: string;
    amount: string;
  }>;
};

export default function useSplitMoneyService() {
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
    console.log({ data, encoded, return: JSON.parse(atob(encoded)) });

    window.location.search = `data=${encoded}`;
  }, []);

  return {
    register,
    handleSubmit,
    watch,
    errors,
    onSubmit,
    fieldArrayHelper
  };
}
