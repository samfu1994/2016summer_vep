import csv
with open('output.csv', 'rb') as csvfile:
	reader = csv.reader(csvfile, delimiter=',', quotechar='|')
	arr = []
	for row in reader:
		break
	arr.append(('name', 'min', 'max', 'mean'))
	for row in reader:
		name = row[0]
		data = row[1:]
		s = 0

		floatData = [float(i) for i in data]
		for ele in floatData:
			s += ele

		mean = s / len(floatData)
		# mean = sum(data) 
		ma = max(floatData)
		mi = min(floatData)
		arr.append((name, mi, ma, mean))
		# arr.append((name, data))
	with open('criterion.csv', 'wb') as writeFile:
		writer = csv.writer(writeFile)
		writer.writerows(arr)