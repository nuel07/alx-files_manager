import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';
class AuthController {
    static async getConnect(req, res) {
	const Authorization = req.header('Authorization') || '';
	const user_creds = Authorization.split(' ')[1];
	if (!user_creds) return res.status(401).send({ error: 'Unauthorized' });
	
	const decodedCreds = Buffer.from(creds, 'base64').toString('utf-8');
	const [email, pass] = decodedCreds.split(':');
	if (!email || !pass) return res.status(401).send({ error: 'Unauthorized' });
	const pswd = sha1(pass);
	const user = await dbClient.users.findOne({
	    email,
	    password: pswd, 
	});
	if (!user) return res.status(401).send({ error: 'Unauthorized' });
	const token = uuidv4();
	const key = `auth_${token}`;
	const expiration = 24 * 3600;
	await redisClient.set(key, user._id.toString(), expiration);
	return res.status(200).send({ token });	
    }

    static async getDisconnect(req, res) {
	const user_token = request.header('X-Token');
	const user_key = `auth_${user_token}`;
	const id = await redisClient.get(key);
	if(id) {
	    await redisClient.del(key);
	    res.status(204).json({});
	} else {
	    res.status(401).json({ error: 'Unauthorized' });
	}	
    }   
}
export default AuthController;
