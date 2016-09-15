import csv

mat = []
with open("ubiq2_new.csv") as csvfile:
	reader = csv.reader(csvfile, delimiter = ',', quotechar = "|")
	for row in reader:
		length = len(row)
		col_index = [i for i in range(length)]
		col_name = row
		break;
	i = 0
	for row in reader:
		mat.append([]);
		mat[i].append(i)
		mat[i].extend(row)
		i += 1
	print len(mat)
	mat = [list(i) for i in zip(*mat)]

	# print len(col_name)
	# print len(mat)
	# print mat[0][2]
	# print mat[2][0]

	for i in range(0, len(mat)):
		if i == 1:
			continue
		for j in range(1, len(mat[1])):
			mat[i][j] = float(mat[i][j])


	with open("transpose_ubiq2.csv", 'wb') as newCsv:
		writer = csv.writer(newCsv, delimiter = ',', quotechar = '|')
		for row in mat:
			writer.writerow(row)
	with open("transpose_ubiq2_col_name.csv", 'wb') as colNameFile:
		writer = csv.writer(colNameFile, delimiter = ',', quotechar = '|')
		writer.writerow(col_index)
		writer.writerow(col_name)
	
