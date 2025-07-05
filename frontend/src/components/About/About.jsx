import './About.css';
export default function About() {
    return (
         <div className="about">
            <img src='assets/pochitchi.webp'/>
          <p>This website was made using react. The leaderboard's database was made with mongodb atlas,
            with the backend hosted on railway.
            The game was made in Phaser! Most of the sprites were made by me. All of the windows
            are resizable and draggable!
          </p>

            <div className='sunken-panel'>
              <table className='interactive' width={'100%'}>
                <thead>
                  <tr>
                    <th colSpan={2}>Controls</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Arrow keys</td>
                    <td>Move</td>
                  </tr>
                  <tr>
                    <td>Z</td>
                    <td>Shoot/Confirm</td>
                  </tr>
                  <tr>
                    <td>Enter</td>
                    <td>Confirm</td>
                  </tr>
                  <tr>
                    <td>Shift</td>
                    <td>Slow move</td>
                  </tr>
                  <tr>
                    <td>ESC</td>
                    <td>Exit to menu</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>if you don't want to add your score to localstorage you can press ESC to skip the score submission</p>

            <p><strong>To-do</strong></p>
            <ul>
              <li>new game enemies</li>
              <li>working game filters</li>
              <li>add webpage</li>
              <li>guestbook??</li>
              <li>make leaderboard look better</li>
              <li>add mobile support</li>
              <li>clippy?</li>
              <li>aesthetic improvements</li>
            </ul>

          <p>version 1 . 1</p>
          </div>
    )
}