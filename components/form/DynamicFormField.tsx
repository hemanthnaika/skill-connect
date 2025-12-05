import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";

interface OptionProps {
  label: string;
  value: string;
}

interface DynamicFormFieldProps<T extends FieldValues> {
  form: { control: Control<T> };
  item: {
    name: Path<T>;
    placeholder: string;
    type: "text" | "email" | "number" | "file" | "textarea" | "checkbox";
    accept?: string;
    options?: OptionProps[];
  };
}

export function DynamicFormField<T extends FieldValues>({
  form,
  item,
}: DynamicFormFieldProps<T>) {
  // ❗️Hook at the TOP — allowed
  const [preview, setPreview] = React.useState<string | null>(null);

  return (
    <FormField
      control={form.control}
      name={item.name}
      render={({ field }) => {
        const { onChange, value, ...restField } = field;

        // ⭐ FILE INPUT WITH PREVIEW + UPLOAD BUTTON
        if (item.type === "file") {
          const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files ? e.target.files[0] : null;
            onChange(file);

            if (file) {
              const url = URL.createObjectURL(file);
              setPreview(url);
            } else {
              setPreview(null);
            }
          };

          return (
            <FormItem>
              <FormLabel>{item.placeholder}</FormLabel>
              <FormControl>
                <div className="flex flex-col gap-3">
                  <Input
                    type="file"
                    accept={item.accept}
                    onChange={handleFileChange}
                  />

                  {preview && (
                    <div className="flex flex-col gap-2">
                      <Image
                        src={preview}
                        alt="Preview"
                        width={128}
                        height={128}
                        className="w-32 h-32 object-cover rounded-md border"
                      />

                      <button
                        type="button"
                        className="px-4 py-2 bg-black text-white rounded-md text-sm"
                        onClick={() => alert("Upload image logic here")}
                      >
                        Upload
                      </button>
                    </div>
                  )}
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          );
        }

        // ⭐ TEXTAREA
        if (item.type === "textarea") {
          return (
            <FormItem>
              <FormLabel>{item.placeholder}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={item.placeholder}
                  {...restField}
                  value={value ?? ""}
                  onChange={(e) => onChange(e.target.value)}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          );
        }

        // ⭐ CHECKBOX GROUP
        if (item.type === "checkbox") {
          const selectedValues: string[] = Array.isArray(value) ? value : [];

          const toggleValue = (checked: boolean, optionValue: string) => {
            if (checked) {
              onChange([...selectedValues, optionValue]);
            } else {
              onChange(selectedValues.filter((v) => v !== optionValue));
            }
          };

          return (
            <FormItem>
              <FormLabel>{item.placeholder}</FormLabel>
              <FormControl>
                <div className="flex gap-2">
                  {item.options?.map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <Input
                        type="checkbox"
                        checked={selectedValues.includes(option.value)}
                        onChange={(e) =>
                          toggleValue(e.target.checked, option.value)
                        }
                      />
                      <label className="cursor-pointer">{option.label}</label>
                    </div>
                  ))}
                </div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          );
        }

        // ⭐ DEFAULT INPUT
        return (
          <FormItem>
            <FormLabel>{item.placeholder}</FormLabel>
            <FormControl>
              <Input
                type={item.type}
                placeholder={item.placeholder}
                {...restField}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
              />
            </FormControl>
            <FormMessage className="text-red-500" />
          </FormItem>
        );
      }}
    />
  );
}
