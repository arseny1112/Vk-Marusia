import styles from "./AuthModal.module.css";
import globalStyles from "../../index.module.css";
import { useContext, useState } from "react";
import logoSvg from "../../assets/imgs/logoBlack.svg";
import { ModalContext } from "../../contexts/ModalContext";
import { AnimatePresence, motion } from "framer-motion";

type FormData = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
};

interface AuthModalProps {
  setName: React.Dispatch<React.SetStateAction<string | null>>;
}

export function AuthModal({ setName }: AuthModalProps) {
  const modalContext = useContext(ModalContext);
  const [mode, setMode] = useState<"login" | "register" | "success">("login");
  const [errors, setErrors] = useState<{
    email?: string;
    firstName?: string;
    lastName?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem("userProfile");
    return savedData
      ? JSON.parse(savedData)
      : {
          email: "",
          firstName: "",
          lastName: "",
          password: "",
          confirmPassword: "",
        };
  });

  if (!modalContext) return null;
  const { isOpen, closeModal } = modalContext;
  if (!isOpen) return null;

  const validate = () => {
    const newErrors: typeof errors = {};
    const existingUsers = JSON.parse(
      localStorage.getItem("userProfiles") || "[]",
    );

    if (!formData.email || !formData.email.includes("@")) {
      newErrors.email = " ";
    } else if (
      existingUsers.some((user: any) => user.email === formData.email)
    ) {
      newErrors.email = "Пользователь с таким email уже существует";
    }

    if (!formData.firstName) {
      newErrors.firstName = " ";
    }

    if (!formData.lastName) {
      newErrors.lastName = " ";
    }

    if (!formData.password) {
      newErrors.password = " ";
    }

    if (
      !formData.password ||
      formData.password.length < 6 ||
      formData.password !== formData.confirmPassword
    ) {
      newErrors.password = " ";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Пароли не совпадают";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mode === "register") {
      const isValid = validate();
      if (!isValid) return;

      const existingUsers = JSON.parse(
        localStorage.getItem("userProfiles") || "[]",
      );
      existingUsers.push(formData);
      localStorage.setItem("userProfiles", JSON.stringify(existingUsers));

      localStorage.setItem("isLoggedIn", "false");
      setMode("success");
      return;
    }

    if (mode === "login") {
      const loginErrors: typeof errors = {};
      const savedProfiles = JSON.parse(
        localStorage.getItem("userProfiles") || "[]",
      );
      const user = savedProfiles.find(
        (user: any) => user.email === formData.email,
      );

      if (!formData.email) {
        loginErrors.email = "Введите email";
      } else if (!formData.email.includes("@")) {
        loginErrors.email = "Некорректный формат email";
      }

      if (!formData.password) {
        loginErrors.password = "Введите пароль";
      } else if (user && user.password !== formData.password) {
        loginErrors.password = "Неверный пароль";
      }

      if (formData.email && !user) {
        loginErrors.email = "Пользователь с таким email не найден";
      }

      setErrors(loginErrors);
      if (Object.keys(loginErrors).length > 0) return;

      if (user) {
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userProfile", JSON.stringify(user));
        closeModal();
        setName(user.firstName);
      }

      return;
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => {
        const updated = { ...prev };
        delete updated[field];
        return updated;
      });
    }
  };

  const backdrop = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.2, ease: "linear" } },
    exit: { opacity: 0, transition: { duration: 0.2, ease: "linear" } },
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            className={styles.overlay}
            onClick={closeModal}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.25 } }}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          />

          <motion.div
            className={styles.backdrop}
            variants={backdrop}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeModal}
          >
            <motion.div
              className={styles.modal}
              initial={{ opacity: 0, y: 100, filter: "blur(12px)" }}
              animate={{ opacity: 1, y: 300, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
              transition={{
                duration: 0.4,
                ease: "easeOut",
                opacity: { duration: 0.4, ease: "easeOut" },
                filter: { duration: 0.4, ease: "easeOut" },
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {mode === "success" ? (
                <div className={`${globalStyles.flex} ${styles.form}`}>
                  <button onClick={closeModal} className={styles.formClose}>
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.5859 12.25L2.79297 4.45706L4.20718 3.04285L12.0001 10.8357L19.793 3.04285L21.2072 4.45706L13.4143 12.25L21.2072 20.0428L19.793 21.4571L12.0001 13.6642L4.20718 21.4571L2.79297 20.0428L10.5859 12.25Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <img
                    src={logoSvg}
                    alt="Логотип"
                    className={styles.formLogo}
                  />
                  <h4 className={styles.successMessage}>
                    Регистрация завершена
                  </h4>
                  <p>Используйте вашу электронную почту для входа</p>
                  <button
                    type="submit"
                    onClick={() => setMode("login")}
                    className={styles.formBtn1}
                  >
                    Войти
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className={`${globalStyles.flex} ${styles.form}`}
                >
                  <button onClick={closeModal} className={styles.formClose}>
                    <svg
                      width="24"
                      height="25"
                      viewBox="0 0 24 25"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.5859 12.25L2.79297 4.45706L4.20718 3.04285L12.0001 10.8357L19.793 3.04285L21.2072 4.45706L13.4143 12.25L21.2072 20.0428L19.793 21.4571L12.0001 13.6642L4.20718 21.4571L2.79297 20.0428L10.5859 12.25Z"
                        fill="black"
                      />
                    </svg>
                  </button>
                  <img
                    src={logoSvg}
                    alt="Логотип"
                    className={styles.formLogo}
                  />

                  <div className={`${globalStyles.flex} ${styles.formInputs}`}>
                    <div
                      className={`${globalStyles.flex} ${styles.formInput} ${errors.email ? styles.errorEmail : ""}`}
                    >
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21 3.75C21.5523 3.75 22 4.19772 22 4.75V20.7566C22 21.3052 21.5447 21.75 21.0082 21.75H2.9918C2.44405 21.75 2 21.3051 2 20.7566V19.75H20V8.05L12 15.25L2 6.25V4.75C2 4.19772 2.44772 3.75 3 3.75H21ZM8 15.75V17.75H0V15.75H8ZM5 10.75V12.75H0V10.75H5ZM19.5659 5.75H4.43414L12 12.5593L19.5659 5.75Z"
                          fill="black"
                          fillOpacity="0.4"
                        />
                      </svg>

                      <input
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        value={formData.email}
                        type="text"
                        placeholder="Электронная почта"
                      />
                    </div>
                    {errors.email && (
                      <div className={styles.errorText}>{errors.email}</div>
                    )}

                    {mode === "register" && (
                      <>
                        <div
                          className={`${globalStyles.flex} ${styles.formInput} ${errors.firstName ? styles.errorFirstName : ""}`}
                        >
                          <svg
                            width="24"
                            height="25"
                            viewBox="0 0 24 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M21 3.75C21.5523 3.75 22 4.19772 22 4.75V20.7566C22 21.3052 21.5447 21.75 21.0082 21.75H2.9918C2.44405 21.75 2 21.3051 2 20.7566V19.75H20V8.05L12 15.25L2 6.25V4.75C2 4.19772 2.44772 3.75 3 3.75H21ZM8 15.75V17.75H0V15.75H8ZM5 10.75V12.75H0V10.75H5ZM19.5659 5.75H4.43414L12 12.5593L19.5659 5.75Z"
                              fill="black"
                              fillOpacity="0.4"
                            />
                          </svg>

                          <input
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            type="text"
                            value={formData.firstName}
                            placeholder="Имя"
                          />
                        </div>

                        <div
                          className={`${globalStyles.flex} ${styles.formInput} ${errors.lastName ? styles.errorLastName : ""}`}
                        >
                          <svg
                            width="24"
                            height="25"
                            viewBox="0 0 24 25"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M21 3.75C21.5523 3.75 22 4.19772 22 4.75V20.7566C22 21.3052 21.5447 21.75 21.0082 21.75H2.9918C2.44405 21.75 2 21.3051 2 20.7566V19.75H20V8.05L12 15.25L2 6.25V4.75C2 4.19772 2.44772 3.75 3 3.75H21ZM8 15.75V17.75H0V15.75H8ZM5 10.75V12.75H0V10.75H5ZM19.5659 5.75H4.43414L12 12.5593L19.5659 5.75Z"
                              fill="black"
                              fillOpacity="0.4"
                            />
                          </svg>

                          <input
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            type="text"
                            value={formData.lastName}
                            placeholder="Фамилия"
                          />
                        </div>
                      </>
                    )}

                    <div
                      className={`${globalStyles.flex} ${styles.formInput} ${errors.password ? styles.errorPassword : ""}`}
                    >
                      <svg
                        width="24"
                        height="25"
                        viewBox="0 0 24 25"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12.917 13.75C12.441 16.5877 9.973 18.75 7 18.75C3.68629 18.75 1 16.0637 1 12.75C1 9.43629 3.68629 6.75 7 6.75C9.973 6.75 12.441 8.91229 12.917 11.75H23V13.75H21V17.75H19V13.75H17V17.75H15V13.75H12.917ZM7 16.75C9.20914 16.75 11 14.9591 11 12.75C11 10.5409 9.20914 8.75 7 8.75C4.79086 8.75 3 10.5409 3 12.75C3 14.9591 4.79086 16.75 7 16.75Z"
                          fill="black"
                          fillOpacity="0.4"
                        />
                      </svg>

                      <input
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        value={formData.password}
                        type="password"
                        placeholder="Пароль"
                      />
                    </div>
                    {errors.password && (
                      <div className={styles.errorText}>{errors.password}</div>
                    )}

                    {mode === "register" && (
                      <div
                        className={`${globalStyles.flex} ${styles.formInput} ${errors.confirmPassword ? styles.errorConfirmPassword : ""}`}
                      >
                        <svg
                          width="24"
                          height="25"
                          viewBox="0 0 24 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.917 13.75C12.441 16.5877 9.973 18.75 7 18.75C3.68629 18.75 1 16.0637 1 12.75C1 9.43629 3.68629 6.75 7 6.75C9.973 6.75 12.441 8.91229 12.917 11.75H23V13.75H21V17.75H19V13.75H17V17.75H15V13.75H12.917ZM7 16.75C9.20914 16.75 11 14.9591 11 12.75C11 10.5409 9.20914 8.75 7 8.75C4.79086 8.75 3 10.5409 3 12.75C3 14.9591 4.79086 16.75 7 16.75Z"
                            fill="black"
                            fillOpacity="0.4"
                          />
                        </svg>

                        <input
                          onChange={(e) =>
                            handleInputChange("confirmPassword", e.target.value)
                          }
                          value={formData.confirmPassword}
                          type="password"
                          placeholder="Подтвердите пароль"
                        />
                      </div>
                    )}
                    {errors.confirmPassword && (
                      <div className={styles.errorText}>
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>

                  {mode === "register" ? (
                    <>
                      <button type="submit" className={styles.formBtn1}>
                        Создать аккаунт
                      </button>
                      <button
                        type="button"
                        className={styles.formBtn2}
                        onClick={() => {
                          setErrors({});
                          setMode("login");
                        }}
                      >
                        У меня есть пароль
                      </button>
                    </>
                  ) : (
                    <>
                      <button type="submit" className={styles.formBtn1}>
                        Войти
                      </button>
                      <button
                        type="button"
                        className={styles.formBtn2}
                        onClick={(event) => {
                          setErrors({});
                          event.preventDefault();
                          setMode("register");
                        }}
                      >
                        Регистрация
                      </button>
                    </>
                  )}
                </form>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
