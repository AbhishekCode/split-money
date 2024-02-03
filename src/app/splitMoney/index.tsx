"use client";

import { UseFieldArrayReturn, UseFormRegister } from "react-hook-form";
import useSplitMoneyService from "./service";
import InputFields from "../components/inputFields";
import React from "react";
import { getAmountValue } from "./utils";
import { remove } from "lodash";

export default function SplitMoney() {
  const service = useSplitMoneyService();
  return (
    <div className="w-full h-full bg-white rounded-lg dark:bg-gray-800 p-10">
      <h3 className="text-center font-extrabold text-xl">Split Amount </h3>
      <form onSubmit={service.handleSubmit(service.onSubmit)}>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <InputFields
            name={"total"}
            register={service.register}
            placeholder="Total amount"
            type="number"
            label={"Total Amount"}
          />
        </div>

        <ParticipantsTable
          fieldArrayHelper={service.fieldArrayHelper}
          register={service.register}
          totalAmount={service.watch("total")}
          participants={service.watch("participants")}
        />
        <button
          type="submit"
          className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Share
        </button>
      </form>
    </div>
  );
}

function ParticipantsTable(props: {
  fieldArrayHelper: UseFieldArrayReturn<any, "participants", "id">;
  register: UseFormRegister<any>;
  totalAmount: string;
  participants: Array<{
    name: string;
    amount: string;
  }>;
}) {
  const [useCustomInput, setUseCustomInput] = React.useState<boolean>(false);

  const updateAmount = React.useCallback(
    (amountValue: number) => {
      props.fieldArrayHelper.fields.forEach((field, index) => {
        props.fieldArrayHelper.update(index, {
          amount: amountValue
        });
      });
    },
    [props.fieldArrayHelper]
  );

  React.useEffect(() => {
    if (useCustomInput === false) {
      updateAmount(
        getAmountValue(
          props.totalAmount,
          props.fieldArrayHelper.fields.length + 1
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.totalAmount]);

  const addParticipant = React.useCallback(() => {
    const amountValue = getAmountValue(
      props.totalAmount,
      props.fieldArrayHelper.fields.length + 1
    );
    props.fieldArrayHelper.append({ name: "", amount: amountValue });
    updateAmount(amountValue);
  }, [props.fieldArrayHelper, props.totalAmount, updateAmount]);

  const removeParticipant = React.useCallback(
    (removeIndex: number) => {
      props.fieldArrayHelper.remove(removeIndex);

      const amountValue = getAmountValue(
        props.totalAmount,
        props.fieldArrayHelper.fields.length - 1
      );

      props.fieldArrayHelper.fields.forEach((field, index) => {
        if (index !== removeIndex) {
          props.fieldArrayHelper.update(index, {
            amount: amountValue
          });
        }
      });
    },
    [props.fieldArrayHelper, props.totalAmount]
  );

  return (
    <div className="w-full max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Name
        </h5>
        <h5 className="text-xl font-medium leading-none text-gray-900 dark:text-white">
          Amount
        </h5>
      </div>
      <div className="flow-root">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700">
          {props.fieldArrayHelper.fields.map((field, index) => (
            <li className="py-3 sm:py-4" key={index}>
              <div className="flex items-center">
                <div className="flex-1 min-w-0 mr-1">
                  <InputFields
                    name={`participants.${index}.name`}
                    register={props.register}
                    placeholder="Name"
                    value={props.participants[index].name}
                  />
                </div>

                <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white mr-1 ml-1">
                  <InputFields
                    name={`participants.${index}.amount`}
                    register={props.register}
                    placeholder="Amount"
                    type="number"
                    value={props.participants[index].amount}
                    disabled={!useCustomInput}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeParticipant(index)}
                  className="text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500">
                  <span className="sr-only">Remove</span>
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button
        type="button"
        onClick={addParticipant}
        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
        Add More
      </button>
    </div>
  );
}
