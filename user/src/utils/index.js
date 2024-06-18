import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export async function generateSalt(){
  const salt =  await bcrypt.genSalt();
  return salt;
}

export async function generatePassword(password,salt){
    const hashedPass = await bcrypt.hash(password,salt);
    return hashedPass;
}

export async function validatePassword( enteredPass, salt , savedPass ){
    const hashedPass = await generatePassword(enteredPass, salt);
    return hashedPass === savedPass;
}

export function generateSignature(payload,secret){
    return jwt.sign(payload,secret , { expiresIn : '30d' })
}

export function verifySignature(token,secret){
    return jwt.verify(token , secret);
}
