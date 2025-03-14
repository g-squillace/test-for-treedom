"use client";

import { useState, useEffect } from "react";

type StepName = "name" | "email" | "password";

const steps = [
  {
    label: "Nome",
    name: "name",
    placeholder: "Inserisci il tuo nome",
    autoComplete: "given-name",
  },
  {
    label: "Email",
    name: "email",
    placeholder: "Inserisci la tua email",
    autoComplete: "email",
  },
  {
    label: "Password",
    name: "password",
    placeholder: "Inserisci la password",
    autoComplete: "off",
  },
];

export default function MultiStepForm() {
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    password: string;
  }>({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<{ [key in StepName]?: string }>({});
  const [currentStep, setCurrentStep] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextStep = () => {
    const currentField = steps[currentStep].name as StepName;
    const value = formData[currentField].trim();
    if (!value) {
      setErrors((prev) => ({
        ...prev,
        [currentField]: "Questo campo è obbligatorio",
      }));
      return;
    }
    if (
      currentField === "email" &&
      !/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value)
    ) {
      setErrors((prev) => ({ ...prev, email: "Inserisci un'email valida" }));
      return;
    }
    setErrors((prev) => ({ ...prev, [currentField]: undefined }));
    setCurrentStep((prev) => Math.min(prev + 1, steps.length));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed w-8/9 lg:w-md p-6 bg-white text-black rounded-lg shadow-md flex flex-col gap-4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h2 className="text-3xl font-semibold">Form test for Treedom 🌴</h2>
      <h3 className="text-sm -mt-2 mb-4"># Guido Squillace</h3>

      <div className="flex flex-col items-center w-full lg:block">
        <div className="relative w-full overflow-hidden">
          <div
            className={`flex transition-all lg:block duration-500 ease-in-out`}
            style={{
              transform: isMobile
                ? `translateX(-${currentStep * 100}%)`
                : "none",
            }}
          >
            {steps.map((step, index) => (
              <div
                key={step.name}
                className={`w-full flex-shrink-0 transition-opacity duration-500 ease-in-out lg:mb-4 p-4 ${
                  index < currentStep
                    ? "bg-green-100"
                    : index === currentStep
                    ? "bg-yellow-100/50"
                    : "bg-gray-100 blur-xs"
                }`}
              >
                <label className="font-semibold text-black/80 mb-2 text-sm block">
                  {step.label}
                </label>
                <input
                  type={step.name === "password" ? "password" : "text"}
                  name={step.name}
                  autoComplete={step.autoComplete}
                  value={formData[step.name as StepName]}
                  onChange={handleChange}
                  className="border-b border-black/20 bg-white p-2 w-full text-sm"
                  placeholder={step.placeholder}
                />
                {errors[step.name as StepName] && (
                  <p className="text-red-500 text-sm">
                    {errors[step.name as StepName]} 😔
                  </p>
                )}
              </div>
            ))}
            {currentStep === steps.length && (
              <div className="w-full flex-shrink-0 transition-opacity duration-500 ease-in-out">
                <h3 className="text-xl font-semibold mb-4 pb-4">Riepilogo</h3>
                <p className="border-b border-black/10 mb-4">
                  <strong>Nome:</strong>
                  <div>{formData.name}</div>
                </p>
                <p className="border-b border-black/10 mb-4">
                  <strong>Email:</strong>
                  <div>{formData.email}</div>
                </p>
                <p className="border-b border-black/10 mb-4">
                  <strong>Password:</strong> <div>{formData.password}</div>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="w-full mt-4 text-sm">
          {currentStep > 0 && (
            <button
              onClick={prevStep}
              className="bg-[#00B8B0]/70 text-white px-4 py-2 rounded uppercase font-bold tracking-widest transition hover:bg-[#00B8B0]/60 lg:hidden block w-full mb-2"
            >
              ⬅️ Indietro
            </button>
          )}

          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              className="bg-[#00B8B0] text-white px-4 py-2 rounded uppercase font-bold tracking-wider transition hover:bg-[#00B8B0]/80 block w-full"
            >
              Avanti ➡️
            </button>
          ) : (
            <button
              onClick={() => alert("Dati inviati!")}
              className="bg-green-700 text-white px-4 py-2 rounded uppercase font-bold tracking-widest transition hover:bg-green-600 block w-full"
            >
              Invia 📤
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
