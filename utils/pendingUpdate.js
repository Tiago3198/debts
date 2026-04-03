let pendingUpdate = null;

export const setPendingUpdate = (debt) => {
  pendingUpdate = debt;
};

export const getPendingUpdate = () => {
  const debt = pendingUpdate;
  pendingUpdate = null;
  return debt;
};