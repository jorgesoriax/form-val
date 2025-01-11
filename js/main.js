const inputUsername = document.getElementById("username");
const inputEmail = document.getElementById("email");
const inputPassword = document.getElementById("password");
const inputPasswordContainer = inputPassword.parentElement.parentElement;
const form = document.getElementById("form");
const messageSummary = document.getElementById("form__header-message-summary");
const passwordVisibilityButton = document.querySelector(
    ".form__group-password-visibility"
);
const messageSummaryTitle = document.querySelector(
    "#form__header-message-summary p"
);
const messageSummaryList = document.querySelector(
    "#form__header-message-summary ul"
);
const conditionals = {
    isNotEmpty: (value) => value !== "",
    maxLength: (value, maxLength) => value.length <= maxLength,
    minLength: (value, minLength) => value.length >= minLength,
    regex: (value, pattern) => pattern.test(value),
};
const rules = {
    username: {
        conditions: [
            {
                func: conditionals["isNotEmpty"],
                args: [],
                errorMessage: "Username esta vacio",
            },
            {
                func: conditionals["maxLength"],
                args: [12],
                errorMessage: "La longitud es mayor a lo permitido",
            },
        ],
    },
    email: {
        conditions: [
            {
                func: conditionals["isNotEmpty"],
                args: [],
                errorMessage: "Email esta vacio",
            },
            {
                func: conditionals["regex"],
                args: [/^\S+@\S+\.\S+$/],
                errorMessage: "El formato del correo es incorrecto.",
            },
        ],
    },
    password: {
        conditions: [
            {
                func: conditionals["isNotEmpty"],
                args: [],
                errorMessage: "Password esta vacio",
            },
            {
                func: conditionals["minLength"],
                args: [8],
                errorMessage: "La longitud es menor a lo permitido",
            },
            {
                func: conditionals["regex"],
                args: [/(?=.*[A-Z])(?=.*[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-])/],
                errorMessage:
                    "Incluye en la contraseña mayúsculas, minúsculas, números y símbolos.",
            },
        ],
    },
};

function validateForm(inputs) {
    const errors = [];

    inputs.forEach((input) => {
        const inputName = input.id;
        const inputValue = input.value;
        const inputRules = rules[inputName];
        let isNotEmptyError = false;

        if (inputRules) {
            inputRules.conditions.forEach(({ func, args, errorMessage }) => {
                const error = {};

                if (
                    func === conditionals["isNotEmpty"] &&
                    !func(inputValue, ...args)
                ) {
                    errors.push({
                        inputName: inputName,
                        error: errorMessage,
                    });

                    isNotEmptyError = true;
                }

                if (!isNotEmptyError && !func(inputValue, ...args)) {
                    errors.push({
                        inputName: inputName,
                        error: errorMessage,
                    });
                }
            });
        }
    });

    return errors;
}

function showMessageSummary(formInputs, inputsErrors) {
    formInputs.forEach((formInput) => {
        formInput.parentElement.classList.remove("form__group--error");
    });

    if (inputsErrors.length > 0) {
        let listItems = "";

        inputsErrors.forEach(({ inputName, error }, i) => {
            listItems += `<li>${error}</li>`;

            formInputs.forEach((formInput) => {
                if (formInput.id === inputName) {
                    formInput.parentElement.classList.add("form__group--error");
                }
            });
        });

        messageSummary.classList.add("form__header-message-summary--show");
        messageSummaryTitle.textContent = `Revisa ${inputsErrors.length} errores a continuación:`;
        messageSummaryList.innerHTML = listItems;
    } else {
        messageSummary.classList.remove("form__header-message-summary--show");
        messageSummaryTitle.textContent = "";
        messageSummaryList.innerHTML = "";
    }
}

form.addEventListener("submit", (e) => {
    e.preventDefault();

    const formInputs = [inputUsername, inputEmail, inputPassword];

    const inputsErrors = validateForm(formInputs);

    showMessageSummary(formInputs, inputsErrors);
});

// function passwordVisibility() {
//     const isPasswordVisibleClass = "is-password-visible";

//     if (!inputPasswordContainer.classList.contains(isPasswordVisibleClass)) {
//         inputPasswordContainer.classList.add(isPasswordVisibleClass);
//         inputPassword.type = "text";
//     } else {
//         inputPasswordContainer.classList.remove(isPasswordVisibleClass);
//         inputPassword.type = "password";
//     }
// }

// passwordVisibilityButton.addEventListener("click", () => passwordVisibility());
