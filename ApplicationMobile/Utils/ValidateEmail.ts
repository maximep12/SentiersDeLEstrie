//S'assure qu'un courriel entré a une bonne forme
export default function ValidateEmail(email: string): boolean {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return reg.test(email);
}
