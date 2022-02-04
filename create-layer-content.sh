echo "Cleaning up old layer..."
rm -rf lambda-layers

echo "Generating Prisma"
sh ./generate-prisma.sh

echo "Creating New Lambda Layer Directories..."
mkdir -p ./lambda-layers/nodejs/node_modules/.prisma
mkdir -p ./lambda-layers/nodejs/node_modules/@prisma

echo "Copying over @prisma and .prisma to the layer"
cp -r ./node_modules/.prisma ./lambda-layers/nodejs/node_modules
cp -r ./node_modules/@prisma ./lambda-layers/nodejs/node_modules
cp -r ./prisma lambda-layers/nodejs/prisma

echo "Copying over SQLite DB's *(only needed for SQLite)*"

echo "Copying over the OpenSSL 1.0.x Binary to the generic client folder in the layer"
cp -f ./node_modules/.prisma/**/libquery_engine-rhel-openssl-1.0.x.so.node ./lambda-layers/nodejs/node_modules/.prisma/client