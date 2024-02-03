"use client";
import {
  UseFieldArrayReturn,
  UseFormRegister,
  UseFormSetValue,
  useWatch
} from "react-hook-form";
import useSplitMoneyService from "./service";
import InputFields from "../components/inputFields";
import React from "react";
import { getAmountValue } from "./utils";
import Button from "@mui/material/Button";
import {
  Card,
  CardActions,
  CardContent,
  Divider,
  IconButton,
  List,
  ListItem,
  Snackbar,
  Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CopyIcon from "@mui/icons-material/ContentCopy";
import CardHeader from "@mui/material/CardHeader";

export default function SplitMoney() {
  const service = useSplitMoneyService();
  return (
    <form onSubmit={service.handleSubmit(service.onSubmit)}>
      <Card variant="elevation" style={{ padding: 2 }}>
        <CardHeader title="Split Amount" />
        <CardContent style={{ padding: 4 }}>
          <InputFields
            name={"total"}
            register={service.register}
            placeholder="Total amount"
            type="number"
            label={"Total Amount"}
            required
            style={{ maxWidth: 400 }}
            variant="outlined"
          />
          <Divider style={{ marginTop: 32, marginBottom: 8 }} />

          <ParticipantsTable
            fieldArrayHelper={service.fieldArrayHelper}
            register={service.register}
            control={service.control}
            setValue={service.setValue}
          />
        </CardContent>

        <CardActions>
          <Button variant="contained" type="submit">
            Generate Link
          </Button>
          {Boolean(service.link) && (
            <div style={{ display: "flex", flexWrap: "wrap" }}>
              <Button
                variant="text"
                title={service.link}
                onClick={() => {
                  window.location.href = service.link as string;
                }}>
                Open Link
              </Button>

              <IconButton
                onClick={() => {
                  navigator.clipboard.writeText(service.link as string);
                  service.setToastMessage("Link Copied");
                }}>
                <CopyIcon />
              </IconButton>
            </div>
          )}
        </CardActions>
      </Card>
      <Snackbar
        open={!!service.toastMessage}
        autoHideDuration={500}
        onClose={service.resetToastMessage}
        message={service.toastMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </form>
  );
}

function ParticipantsTable(props: {
  fieldArrayHelper: UseFieldArrayReturn<any, "participants", "id">;
  register: UseFormRegister<any>;
  control: any;
  setValue: UseFormSetValue<any>;
}) {
  const totalAmount = useWatch({ control: props.control, name: "total" });

  const [useCustomInput, setUseCustomInput] = React.useState<boolean>(false);

  const updateAmount = React.useCallback(
    (amountValue: number) => {
      props.fieldArrayHelper.fields.forEach((field, index) => {
        props.setValue(`participants.${index}.amount`, amountValue);
      });
    },
    [props]
  );

  React.useEffect(() => {
    if (useCustomInput === false) {
      updateAmount(
        getAmountValue(totalAmount, props.fieldArrayHelper.fields.length)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalAmount]);

  const addParticipant = React.useCallback(() => {
    const amountValue = getAmountValue(
      totalAmount,
      props.fieldArrayHelper.fields.length + 1
    );
    props.fieldArrayHelper.append({
      index: props.fieldArrayHelper.fields.length + 1,
      name: "",
      amount: amountValue
    });
    updateAmount(amountValue);
  }, [props.fieldArrayHelper, totalAmount, updateAmount]);

  const removeParticipant = React.useCallback(
    (removeIndex: number) => {
      props.fieldArrayHelper.remove(removeIndex);

      const amountValue = getAmountValue(
        totalAmount,
        props.fieldArrayHelper.fields.length - 1
      );

      props.fieldArrayHelper.fields.forEach((field, index) => {
        props.setValue(`participants.${index}.amount`, amountValue);
      });
    },
    [props, totalAmount]
  );

  return (
    <List sx={{ width: "100%", bgcolor: "background.paper" }}>
      <Typography variant="h5" gutterBottom>
        Participants
      </Typography>
      {props.fieldArrayHelper.fields.map((field, index) => (
        <ListItem
          key={`participants.${field.id}`}
          style={{ padding: 0, marginBottom: 8 }}>
          <InputFields
            name={`participants.${index}.name`}
            register={props.register}
            placeholder="Name"
            required
            variant="outlined"
            style={{ minWidth: 250, maxWidth: 400 }}
          />
          <InputFields
            name={`participants.${index}.amount`}
            register={props.register}
            placeholder="Amount"
            type="number"
            variant="outlined"
            disabled={!useCustomInput}
            style={{ marginLeft: 4, maxWidth: 100 }}
          />
          <IconButton
            aria-label="delete"
            onClick={() => removeParticipant(index)}>
            <DeleteIcon />
          </IconButton>
        </ListItem>
      ))}
      <Button onClick={addParticipant} variant="outlined">
        Add Participant
      </Button>
    </List>
  );
}
