import styles from './ew.module.scss'

import { createSignal } from 'solid-js'
const [code, setCode] = createSignal('w');

export default function Home(){
  
  return(
    <main>
      <div class={styles.form}>
        <form>
            <div>
              <h1>Code was send to</h1>
              <div class={styles.inputs}>
                <input type="text" maxLength={6} placeholder='Enter your code' onChange={(e) => setCode(e.currentTarget.value)}/>
                
              </div>
            </div>
          
        </form>
        <button type='submit'>Send code</button>
      </div>
    </main>
  )
}