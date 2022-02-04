echo "Building Libraries to ensure binaries are available..."
for file in **/*.prisma
do
    echo "Generating ${file##*/}" 
    npx prisma db push --schema=${file}
    npx prisma generate --schema=${file}
done