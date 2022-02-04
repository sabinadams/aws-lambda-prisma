echo "Building Libraries to ensure binaries are available..."
for file in **/*.prisma
do
    echo "Generating ${file##*/}" 
    npx prisma generate --schema=${file}
done