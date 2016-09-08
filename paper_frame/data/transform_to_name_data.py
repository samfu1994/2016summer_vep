import csv

with open('ubiq2.csv', 'rb') as csvfile:
	reader = csv.reader(csvfile, delimiter=',', quotechar='|')
	attrs = 0
	docus = 0
	for row in reader:
		attrs = len(row)
		break
	docus = sum([1 for row in reader])

	csvfile.seek(0)

	arr = [[] for i in range(attrs)]


	for row in reader:
		i = 0
		for ele in row:
			arr[i].append(ele)
			arr[i].append([])
			i += 1
		break

	for row in reader:
		i = 0
		for ele in row:
			arr[i][1].append(ele)
			i += 1

	arr[0][1] = 'data';
	arr[0][0] = 'name';
			
	with open("output.csv", "wb") as f:
	    writer = csv.writer(f)
	    writer.writerows(arr)
