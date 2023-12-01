-- contain an aggregation
db.usersCollection.aggregate(
  [
    {
      $match: {
        _id: ObjectId('6563f86d7b01ec4051c18258')
      }
    },
    {
      $project: {
        contactsCount: { $size: "$contacts" }
      }
    }
  ]
)

-- a complex search criterion
db.emailsCollection.find({
    sender_id: ObjectId("6563e6f2fc13ae0db24ce2a9"),
    $or: [
        { receiver_id: ObjectId("6563e6f2fc13ae0db24ce2aa") },
        { receiver_id: ObjectId("6563e6f2fc13ae0db24ce2ae") }
    ]
});


-- Count Documents for a Specific User:
db.foldersCollection.countDocuments({
  sender_id: ObjectId('6563e6f2fc13ae0db24ce2a9')
});

-- Update Document Based on Query Parameter
db.usersCollection.updateOne(
  { id: ObjectId("6563e6c1fc13ae0d4c4cd3f4") },
  { $set: { cellphone: "111-222-3333" } }
);

-- Find emails within a specific range
db.emailsCollection.find({
  "sent_time": {"$gte": ISODate("2022-01-01T00:00:00Z"), "$lt": ISODate("2023-08-01T00:00:00Z")}
  }).toArray()