import { useState, useEffect } from 'react';
import './style.css';
import firebase from './firebaseConnection';

function App() {
  const [idPost, setIdPost] = useState('');
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [posts, setPosts] = useState([]);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [user, setUser] = useState(false);
  const [userLogged, setUserLogged] = useState({}); 


  useEffect(()=>{
    async function loadPosts(){
      await firebase.firestore().collection('posts')
      .onSnapshot((doc)=>{
        let meusPosts = [];

        doc.forEach((item)=>{
          meusPosts.push({
            id: item.id,
            titulo: item.data().titulo,
            autor: item.data().autor,
          })
        });

        setPosts(meusPosts);

      })
    }

    loadPosts();

  }, []);

  useEffect(() => {

    async function checkLogin(){
      await firebase.auth().onAuthStateChanged((user) => {
        if(user){
          setUser(true);
          setUserLogged({
           uid: user.uid,
           email: user.email 
          })
          //se tem user logado
        }else{
          //n tem usuário logado
          setUser(false);
          setUserLogged({});
        }
      })
    }

    checkLogin();

  }, []);

  async function handleAdd(){
    
    await firebase.firestore().collection('posts')
    .add({
      titulo: titulo,
      autor: autor
    })
    .then(()=>{
      console.log(' DADOS CADASTRADOS COM SUCESSO!');
      setTitulo('');
      setAutor('');
    })
    .catch((error)=>{
      console.log('Gerou algum erro: ' + error)
    })
  }

    /*await firebase.firestore().collection('posts')
    .doc('12345')
    .set({
      titulo: titulo,
      autor: autor
    })
    .then(()=>{
      console.log(' DADOS CADASTRADOS COM SUCESSO!');
    })
    .catch((error)=>{
      console.log('Gerou algum erro: ' + error)
    })
  }*/

  async function buscaPost(){
   
    await firebase.firestore().collection('posts')
    .get()
    .then((snapshot)=>{
      let lista = [];
      snapshot.forEach((doc)=>{
        lista.push({
          id: doc.id,
          titulo: doc.data().titulo,
          autor: doc.data().autor
        })
      })

      setPosts(lista);

    })
    .catch(()=>{
      console.log('Deu erro!');
    })

    /* await firebase.firestore().collection('posts')
    .doc('123')
    .get()
    .then((snapshot)=>{
      setTitulo(snapshot.data().titulo);
      setAutor(snapshot.data().autor)
    })
    .catch(()=>{
      console.log('Deu erro: ')
    })*/
  }

  async function editarPost(){
    await firebase.firestore().collection('posts')
    .doc(idPost)
    .update({
      titulo: titulo,
      autor: autor
    })
    .then(()=>{
      console.log('Dados atualizados com sucesso!');
      setIdPost('');
      setTitulo('');
      setAutor('');
    })
    .catch(()=>{
      console.log('Deu erro');
    })
  }

  async function excluirPost(id){
    await firebase.firestore().collection('posts').doc(id)
    .delete()
    .then(()=>{
      alert('Esse post foi excluido!')
    })
    .catch('Deu erro ao excluir')
  }

  async function novoUsuario(){
    await firebase.auth().createUserWithEmailAndPassword(email, senha)
    .then((value) =>{
      console.log(value);
    })
    .catch((error) => {
      
      if(error.code === 'auth/weak-password'){
        alert('senha muita fraca')
      }else if(error.code === 'auth/email-already-in-use'){
        alert('Email existente já cadastrado')
      }
    })
  }

  async function logout(){
    await firebase.auth().signOut();
  }

  async function fazerLogin(){
    await firebase.auth().signInWithEmailAndPassword(email, senha)
    .then((value) =>{
      console.log(value.user);
    })
    .catch((error) =>{
      console.log('Erro ao fazer login' + error);
    })
  }

  return (
    <div>
      <h1>React JS + Firebase</h1><br/>


      {user && (
      <div> 
        <strong>Seja bem vindo! (vc está logado)</strong> <br/>
        <span>{userLogged.uid} - {userLogged.email}</span>
        <br/> <br/>
      </div>
      )}

    <div className="container">
      <label>Email</label>
      <input type="text" value={email} onChange={(e) => setEmail(e.target.value)}/>
      
      <label>Senha</label>
      <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)}/> <br/> 
      <button onClick={ fazerLogin }>Fazer Login</button> 
      <button onClick={ novoUsuario }>Cadastrar</button> 
      <button onClick={ logout }>Sair da Conta!</button> <br/>
    </div>
    
    <hr/>

    <div className="container">
    <h2>Banco de Dados:</h2>
    <label>ID</label>
    <input type="text" value={idPost} onChange={(e) => setIdPost(e.target.value)}/>
    
    <label>Titulo: </label>
    <textarea type="text" value={titulo} onChange={ (e) => setTitulo(e.target.value)}/>

    <label>Autor:</label>
    <input type="text" value={autor} onChange={ (e) => setAutor(e.target.value)}/>
    
    <button onClick={ handleAdd }>Cadastrar</button>
    <button onClick={ buscaPost }>Buscar Post</button> 
    <button onClick={ editarPost }>Editar Post</button><br/> 
    
    <ul>
      {posts.map((post)=>{
        return(
          <li key={post.id}>
            <span>ID: {post.id}</span> <br/>
            <span>Titulo: {post.titulo} </span> <br/>
            <span>Autor: {post.autor}</span> <br/>
            <button onClick={()=> excluirPost(post.id) }>Excluir Post</button> <br/> <br/>
          </li>
        )
      })}
    </ul>

    </div>
    </div>
  );
}

export default App;
