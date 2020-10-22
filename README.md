# Traveler Injection

## Install

```bash
$ git clone https://github.com/yoshiiinuma/traveler-injection
$ npm i
$ npm run build
```
## Run Test

```bash
$ npm run test
```

## Configuration

Configration file name must be {production|development|test}.json.

```json
{
  "host": "localhost",
  "port": "3306",
  "user": "user",
  "password": "password",
  "database": "database",
  "ssl": {
    "ca": "./path/to/ca.pem",
    "key": "./path/to/client-key.pem",
    "cert": "./path/to/client-cert.pem"
  }
}
```

## Inject Usage

Injects the given CSV file to MySQL database.

```bash
$ ./bin/inject <CSV> <ENV>

# CSV: path to csv file
# ENV: {production|development|test}
```

## Check Usage

Validates the given CSV file.

```bash
$ ./bin/check <CSV>

# CSV: path to csv file
```

## Browse Usage

See the data in the given CSV file.

```bash
$ ./bin/browse <CSV>

# CSV: path to csv file
```

## Connect Usage

Tests the connection to the database.

```bash
$ ./bin/connect <ENV>

# ENV: {production|development|test}
```

