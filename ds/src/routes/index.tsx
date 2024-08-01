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
  const [login, setLogin] = createSignal(true);
  

  // функции 
  const handler = () => {
    setCount((prev) => prev + 1)
    console.log(count())   
  }
  function safety(){
    setCount((prev) => prev = 0) 
  }
  function register(){
    setLogin(false)
  }
  function logins(){
    setLogin(true)
  }
  setTimeout(safety, 10000);

  // функции для стилизации 

  const [clas, setClas] = createSignal(false);
  const addClass = () => {
    setClas(true)
  }

  return (
    <main class={styles.wrapper}>
        {login() ? (
          <div class={styles.cont} classList={{[styles.next]: true}}>
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
        ) : (
        <div class={styles.cont}>
        <form action={postToServer} method="post" class={styles.form}>
          <input type="hidden" name="redirectTo" value={props.params.redirectTo ?? "/"} />
          
          <input type="radio" name="loginType" checked={true} value="register" class={sai.particlescheckbox}/>
          <div class={sai.div}><h1>Register</h1></div >

            <div class={styles.inputik}>
              <input name="username" placeholder="Login" autocomplete="username" />
            </div>
            <div class={styles.inputik}>
              <input name="password" type="password" placeholder="Password" autocomplete="current-password" />
            </div>
            <div class={styles.inputik}>
              <input name="mail" type="mail" placeholder="Mail" autocomplete="current-password" />
            </div>
            <div class={styles.inputik}>
              <input name="nickname" placeholder="Nickname" autocomplete="username" />
            </div>
            <div class={styles.inputik}>
            <select name="day" id="">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4 </option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
                <option>9</option>
                <option>10</option>
                <option>11</option>
                <option>12 </option>
                <option>13</option>
                <option>14 </option>
                <option>15</option>
                <option>16</option>
                <option>17</option>
                <option>18</option>
                <option>19</option>
                <option>20</option>
                <option>21</option>
                <option>22 </option>
                <option>23</option>
                <option>24</option>
                <option>25</option>
                <option>26</option>
                <option>27</option>
                <option>28</option>
                <option>29</option>
                <option>30</option>
                <option>31</option>
              </select>
              <select name="month" id="">
                <option>Janyary</option>
                <option>February</option>
                <option>March</option>
                <option>April </option>
                <option>May</option>
                <option>June</option>
                <option>July</option>
                <option>August</option>
                <option>September</option>
                <option>October</option>
                <option>November</option>
                <option>December</option>
              </select>
              <input name="year" type="mail" placeholder="Year" autocomplete="current-password" />
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
        <button onClick={logins} class={styles.btn2}>don't have an account?</button>
      </div>
      
      )}
      
    </main>
  );
}