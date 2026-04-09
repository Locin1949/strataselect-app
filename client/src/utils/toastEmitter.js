let toastRef = null;

export function registerToast(fn) {
  toastRef = fn;
}

export const toast = {
  success: (msg) => toastRef && toastRef(msg, "success"),
  error: (msg) => toastRef && toastRef(msg, "error"),
  info: (msg) => toastRef && toastRef(msg, "info")
};
