import styles from './safety.module.scss'
import { sendVerificationCode } from "../../api/SendEmail";
import { createSignal } from 'solid-js';
const code = await sendVerificationCode(email());
const [email, setEmail] = createSignal('');
export default function main(){


    
    return(
        <main>
        <div class={styles.verifyBox}>
            <div class={styles.wrap}>
                <h1>Verification</h1>
                <div class={styles.inputik}>
                    <span>
                    </span>
                    <input name="code" type='code' placeholder="Hi" autocomplete="none" maxlength={6} />
                </div>
            </div>
        </div>
        </main>
    )
}