import AddUser from "../components/AddUser";
import { StoreProvider } from "../redux/StoreProvider";
export default function Signup() {
  return (
    <main>
        <StoreProvider>
            <AddUser/>
        </StoreProvider>
    </main>
  );
}
