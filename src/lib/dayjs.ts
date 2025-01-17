import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.locale(ptBr);
dayjs.extend(relativeTime);

export { dayjs };
