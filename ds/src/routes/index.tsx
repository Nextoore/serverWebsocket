import {
  useSubmission,
  type RouteSectionProps
} from "@solidjs/router";
import { Show } from "solid-js";
import { postToServer } from "~/api";
import sai from './radio.module.scss'
import styles from '../App.module.scss'
import img from '../img/image.png'
import { createSignal } from "solid-js";


export default function Login(props: RouteSectionProps) {
  const loggingIn = useSubmission(postToServer);
  const [count, setCount] = createSignal(0);
  const handler = () => {
    setCount((prev) => prev + 1)
    console.log(count())   
  }
  function safety(){
    setCount((prev) => prev = 0) 
  }
  setTimeout(safety, 60000);
  return (
    <main class={styles.wrapper}>
        <img src={img}></img>
        <form action={postToServer} method="post" class={styles.form}>
          <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />
          <fieldset>
            <label class={sai.particlescheckboxcontainer}>
              <input type="radio" name="loginType" value="login" checked={true} class={sai.particlescheckbox}/> 
              <span><h1>Login</h1></span>
            </label>
            <label class={sai.particlescheckboxcontainer}>
              <input type="radio" name="loginType" value="register" class={sai.particlescheckbox}/>
              <span><h1>Register</h1></span>
            </label>
          </fieldset>
          <div class={styles.container}>
            <div class={styles.inputik}>
              <input name="username" placeholder="Login" autocomplete="username" />
            </div>
            <div class={styles.inputik}>
              <input name="password" type="password" placeholder="Password" autocomplete="current-password" />
            </div>
          </div>
        
          <button type="submit" class={styles.btn} onClick={[handler]} disabled={count() > 3}>Login</button> 
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
      
    </main>
  );
}