import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const initializeFirebaseAdmin = () => {
  initializeApp({
    credential: applicationDefault(),
  });
};

const fetchAllAccountUids = async () => {
  const accounts = (await getAuth().listUsers(100)).users;

  return accounts.map((account) => account.uid);
};

const deleteAccountsWithUids = async (uids) => {
  await getAuth().deleteUsers(uids);
};

const main = () => {
  initializeFirebaseAdmin();

  fetchAllAccountUids()
    .then((uids) => deleteAccountsWithUids(uids))
    .then(() => console.log('Users deleted'))
    .catch((error) => console.log(error))
    .finally(() => console.log('Script End'));
};

main();

