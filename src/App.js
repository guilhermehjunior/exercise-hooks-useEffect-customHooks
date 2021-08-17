import React, { useState } from 'react'

function Name({name, onNameChange}) {
  return (
    <div>
      <label htmlFor="name">Name: </label>
      <input id="name" value={name} onChange={onNameChange} />
    </div>
  )
}

// 🐨 receba `animal` e `onAnimalChange` como  props nesse componente
function FavoriteAnimal({ animal, onAnimalChange }) {
  // 💣 apague essa parte, já que agora ela será gerenciada no App.js
  return (
    <div>
      <label htmlFor="animal">Favorite Animal: </label>
      <input
        id="animal"
        value={animal}
        onChange={event => onAnimalChange(event.target.value)}
      />
    </div>
  )
}


function Display({name, animal}) {
  return <div>{`Hey ${name}, your favorite animal is: ${animal}!`}</div>
}

function App() {
  const [animal, setAnimal] = useState('');
  const [name, setName] = useState('');
  return (
    <form>
      <Name name={name} onNameChange={event => setName(event.target.value)} />
      {/* 🐨 passe o animal e onAnimalChange como props aqui (semelhante ao que foi feito anteriormente no componente Name acima) */}
      <FavoriteAnimal animal={ animal } onAnimalChange={ setAnimal } />
      {/* 🐨 passe a prop animal aqui */}
      <Display name={name} animal={ animal } />
    </form>
  )
}

export default App;
