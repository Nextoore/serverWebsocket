import {
  useSubmission,
  type RouteSectionProps
} from "@solidjs/router";
import { Show } from "solid-js";
import { postToServer } from "~/api";
import sai from './radio.module.scss'
import styles from '../App.module.scss'
import img from './next.module.scss'
import { createSignal } from "solid-js";


export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(postToServer);
  const [count, setCount] = createSignal(0);
  const [login, setLogin] = createSignal(true);
  

  // функции 
  const handler = () => {
    setCount((prev) => prev + 1)
    console.log(count())   
  }
  function safety(){
    setCount((prev) => prev = 0) 
  }
  
  setTimeout(safety, 10000);

  // функции для стилизации 

  const [clas, setClas] = createSignal(false);
  const addClass = () => {
    setClas(true)
  }
  const removeClass = () => {
    setClas(false)
  }
  function register(){
    setLogin(false)
  }
  function logins(){
    setLogin(true)
  }
  return (
    <main class={styles.wrapper}>
      <div class={styles.home} classList={{[styles.nexto]: clas()}}>
        <div class={styles.loogin} classList={{[styles.next]: clas()}}>
            <form action={postToServer} method="post" class={styles.form}>
            <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />

              <input type="radio" name="loginType" checked={true} value="login" class={sai.particlescheckbox}/>
                <div class={sai.div}><h1>Login</h1></div>

              <div class={styles.inputik}>
                <input name="username" placeholder="Login" autocomplete="username" />
              </div>
              <div class={styles.inputik}>
                <input name="password" type="password" placeholder="Password" autocomplete="current-password" />
              </div>

            <button type="submit" class={styles.btn} onClick={handler} disabled={count() > 3}>Login</button> 
            <Show when={loggingIn.result} >
              <p class={styles.alert} role="alert" id="error-message">
                {loggingIn.result!.message}
              </p>
            </Show>
            <Show when={count() > 3} >
              <p class={styles.alert} role="alert" id="error-message">
              Привышен лимит запросов, пожалуйста, подождите
              </p>
            </Show>
          </form>
          <button onClick={() => { register(); addClass();}} class={styles.btn2}>don't have an account?</button>
        </div>
        <div class={styles.register} classList={{[styles.nextoora]: login()}}>
        <form action={postToServer} method="post" class={styles.form}>
          <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />
          
          <input type="radio" name="loginType" checked={true} value="register" class={sai.particlescheckbox}/>
          <div class={sai.div}><h1>Register</h1></div >

            <div class={styles.inputik}>
              <input name="username" placeholder="Login" autocomplete="username" />
            </div>
            <div class={styles.inputik}>
              <input name="mail" type="mail" placeholder="Mail" autocomplete="current-password" />
            </div>
            <div class={styles.inputik}>
              <input name="password" type="password" placeholder="Password" autocomplete="current-password" />
            </div>
                    
          <button type="submit" class={styles.btn} onClick={handler} disabled={count() > 3}>Registration</button> 
          <Show when={loggingIn.result} >
            <p class={styles.alert} role="alert" id="error-message">
              {loggingIn.result!.message}
            </p>
          </Show>
          <Show when={count() > 3} >
            <p class={styles.alert} role="alert" id="error-message">
            Привышен лимит запросов, пожалуйста, подождите
            </p>
          </Show>
        </form>
        <button onClick={() => { logins(); removeClass();}} class={styles.btn2}>Already have an account?</button>
      </div>
    </div>
    </main>
  );
}