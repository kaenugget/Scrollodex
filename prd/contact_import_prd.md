# Contacts Import

Contacts can be imported using the CSV file format.

## Contacts Import Screen

### As a user I would like to import my contacts from popular services (i.e. Address Book, Gmail, LinkedIn) in CSV format.

The following fields that should be supported should be the same as those listed in profile_prd.md.

## Duplicate Contacts

When I import contacts the software should be able to deduplicate contacts. If I already imported someone it should not create them again.

A contact should be considered duplicate if the contact has the same email address or the same phone number. Phone numbers sometimes come with the country code and sometimes they don't so this should be taken into account when deduplicating. For example +6588888888 would be considered the same number as 88888888 for someone who lives in Singapore.