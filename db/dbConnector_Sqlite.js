const { MongoClient, ObjectId } = require('mongodb');

const uri = 'mongodb+srv://LIHANCAI:Aa09241222@cluster0.xjd6arc.mongodb.net/';
const databaseName = 'emailManagement';
const collectionName = 'emailManagement';

async function verifyLogin(username, password) {
  const client = new MongoClient(uri);
  try {
    // 连接到MongoDB
    await client.connect();
    console.log('Connected to the database');

    // 选择数据库和集合
    const db = client.db(databaseName);
    const collection = db.collection('user');

    // 构建查询以匹配用户名和密码
    const query = { 'username': username, 'password': password };

    // 执行查询
    const user = await collection.findOne(query);

    // 检查用户是否存在
    if (user) {
      console.log('Login successful');
      // console.log(user);
      return user;
    } else {
      console.log('Login failed: User not found');
      return null;
    }
  } catch (error) {
    // 如果出现任何错误，记录错误并返回null
    console.error('Error verifying login:', error);
    return null;
  } finally {
    // 关闭数据库连接
    await client.close();
    console.log('Connection closed');
  }
}

//查看接收邮件
async function checkReceivedEmails(user_id) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(databaseName);
    const emailsCollection = db.collection('email');

    // 创建查询条件，将字符串 ID 转换为 ObjectId
    const query = { 'receiver_id': new ObjectId(user_id) };

    // 执行查询操作
    const emails = await emailsCollection.find(query).toArray();

    // console.log(emails); // 打印查询结果
    return emails;
  } catch (error) {
    console.error('Error finding emails:', error);
  } finally {
    // 关闭数据库连接
    await client.close();
  }
}

//查看草稿箱邮件
async function checkDrafts(user_id) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(databaseName);
    const foldersCollection = db.collection("folders");
    const emailsCollection = db.collection("email");

    // 首先，根据 user_id 和 foldername 查找所有的 email_id
    const foldersQuery = { 'user_id': new ObjectId(user_id), 'foldername': 'draft' };
    const folders = await foldersCollection.find(foldersQuery).toArray();

    // 从 folders 文档中提取所有的 email_id
    const emailIds = folders.map(folder => folder.email_id);
    console.log(emailIds); // 打印查询结果

    // 然后，使用这些 email_id 查询 emails 集合
    const emailsQuery = { 'id': { $in: emailIds } };
    const emails = await emailsCollection.find(emailsQuery).toArray();
    console.log(emails); // 打印查询结果

    return emails;
  } catch (error) {
    console.error('Error finding draft emails:', error);
  } finally {
    // 关闭数据库连接
    await client.close();
  }
}

//查看已发送邮件
async function checksentemails(user_id) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(databaseName);
    const foldersCollection = db.collection("folders");
    const emailsCollection = db.collection("email");

    // 首先，根据 user_id 和 foldername 查找所有的 email_id
    const foldersQuery = { 'user_id': new ObjectId(user_id), 'foldername': 'sent' };
    const folders = await foldersCollection.find(foldersQuery).toArray();

    // 从 folders 文档中提取所有的 email_id
    const emailIds = folders.map(folder => folder.email_id);
    console.log(emailIds); // 打印查询结果

    // 然后，使用这些 email_id 查询 emails 集合
    const emailsQuery = { 'id': { $in: emailIds } };
    const emails = await emailsCollection.find(emailsQuery).toArray();
    console.log(emails); // 打印查询结果

    return emails;
  } catch (error) {
    console.error('Error finding draft emails:', error);
  } finally {
    // 关闭数据库连接
    await client.close();
  }

}
//查看联系人
async function checkContacts(user_id) {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(databaseName);
    const contactsCollection = db.collection("user");

    // 首先，根据 user_id 查找对应的contacts
    const user = await contactsCollection.findOne({ 'id': new ObjectId(user_id) });
    const contactIds = user.contacts;
    console.log(contactIds);

    /// 接着，使用这些 ID 查询相同集合中的联系人详细信息
    const contactsQuery = { 'id': { $in: contactIds } };
    const contactsDetails = await contactsCollection.find(contactsQuery).toArray();

    console.log(contactsDetails);
    return contactsDetails;
  } catch (error) {
    console.error('Error finding draft emails:', error);
  } finally {
    // 关闭数据库连接
    await client.close();
  }
}

//发送邮件
async function sendemail(title, sender_id, created_time, sending_time, content,  receiver_id) {
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    // 连接到 MongoDB
    await client.connect();
    const db = client.db(databaseName);
    const collection = db.collection('email');

    // 创建邮件文档对象
    const emailDocument = {
      title: title,
      sender_id: ObjectId(sender_id), // 确保 sender_id 是 ObjectId
      created_time: new Date(created_time),
      sending_time: new Date(sending_time),
      content: content,
      receiver_id: ObjectId(receiver_id) // 确保 receiver_id 是 ObjectId
    };

    // 插入邮件文档到 emails 集合
    const result = await collection.insertOne(emailDocument);

    console.log(`Email sent with the following id: ${result.insertedId}`);
    return result.insertedId; // 返回插入的邮件 ID
  } catch (error) {
    console.error('Error sending email:', error);
  } finally {
    // 关闭数据库连接
    await client.close();
  }
}

module.exports = {
  verifyLogin,
  checkReceivedEmails,
  checkDrafts,
  checksentemails,
  checkContacts,
  sendemail,
}
