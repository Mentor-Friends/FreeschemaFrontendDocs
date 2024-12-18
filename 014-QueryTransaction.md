# Query Transaction


The LocalTransaction class enables batch operations, such as creating instances and connections, within a transaction. It supports committing changes or rolling back in case of errors.

### Example

```js
// Create a new instance of transactions
const transaction = new LocalTransaction()
    try {
      // Initialize the transaction 
      await transaction.initialize()

      // perform actions
      const widgetConcept = await transaction.MakeTheInstanceConceptLocal(
        "the_widget",
        '',
        false,
        999,
        4,
        999
      )
      const nameConcept = await transaction.MakeTheInstanceConceptLocal(
        "the_widget_name",
        'login',
        false,
        999,
        4,
        999
      )
      
      const conn = await transaction.CreateConnectionBetweenTwoConceptsLocal(
        widgetConcept,
        nameConcept,
        "the_widget_login",
        true
      )

      // Sync the actions
      await transaction.commitTransaction()

    } catch (err) {
      // Revert all the actions performed
      transaction.rollbackTransaction()
    }

```

This approach ensures atomicity: all changes are committed together or fully reverted on failure.

> Only create functionality  is supported. For retriving use general methods.